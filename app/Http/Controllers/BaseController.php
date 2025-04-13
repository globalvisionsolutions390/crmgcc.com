<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\Activation\IActivationService;
use Constants;
use Illuminate\Http\Request;

class BaseController extends Controller
{

  public function accessDenied()
  {
    $pageConfigs = ['myLayout' => 'blank', 'displayCustomizer' => false];
    return view('access-denied', ['pageConfigs' => $pageConfigs]);
  }

  public function Index()
  {
    return view('activation.index');
  }

  public function activate(Request $request)
  {
    // Validate the request input
    $request->validate([
      'licenseKey' => 'required|string',
    ]);

    $licenseKey = $request->input('licenseKey');

    /** @var IActivationService $activationService */
    $activationService = app()->make(IActivationService::class);

    // Check if the request includes an envato_username.
    if ($request->filled('envato_username')) {
      // Envato activation: expect envato_username, email, and optionally activation_type.
      $envatoUsername = $request->input('envato_username');
      $email = $request->input('email', ''); // You can make this required if desired.
      $activationType = $request->input('activation_type', 'live');
      // For domain, you can use the current domain
      $domain = request()->getSchemeAndHttpHost();

      $result = $activationService->envatoActivate($licenseKey, $envatoUsername, $domain, $email, $activationType);
    } else {
      // Standard activation by purchase code
      //{"success":true,"activation_code":"1445b2c1-ad6e-4615-aea7-2152b59b9bc3","activation_type":"live","domain":"http:\/\/localhost:8000","purchase_code":"5b101207-20a8-46b4-af1f-3aeaea669e27","message":"Activation successful"}
      $result = $activationService->activate($licenseKey);
    }

    // Check result status and redirect back with an appropriate message.
    if ($result->get('success')) {
      //Save activation code to a file in storage folder
      $activationCode = $result->get('activation_code');

      $file = storage_path('app/activation_code.txt');
      file_put_contents($file, $activationCode);
      return redirect()->route('activation.index')->with('message', 'Activation successful.');
    } else {
      $errorMsg = $result->get('message') ?? 'Activation failed. Please try again.';
      return redirect()->route('activation.index')->with('error', $errorMsg);
    }
  }

  public function getSearchDataAjax()
  {
    //Get json file from resources/menu
    $menuJson = tenant('id') == null ? file_get_contents(base_path('resources/menu/verticalMenu.json')) : file_get_contents(base_path('resources/menu/tenantVerticalMenu.json'));

    // Decode JSON into an associative array
    $menuData = json_decode($menuJson, true);

    $menuItems = $menuData['menu'];

    $response[] = [];

    //Populate pages
    $pages = [];
    foreach ($menuItems as $item) {
      if (isset($item['menuHeader'])) {
        continue;
      }
      //Check if item has submenu
      if (isset($item['submenu'])) {
        foreach ($item['submenu'] as $subItem) {
          $itemColl = collect($subItem);
          //Remove first / from url
          $url = substr($itemColl->get('url'), 1);
          $pages[] = [
            'name' => $itemColl->get('name'),
            'url' => $url,
            'icon' => $itemColl->get('icon'),
          ];
        }
      } else {
        $itemColl = collect($item);
        //Remove first / from url
        $url = substr($itemColl->get('url'), 1);
        $pages[] = [
          'name' => $itemColl->get('name'),
          'url' => $url,
          'icon' => $itemColl->get('icon'),
        ];
      }
    }

    $response = [
      'pages' => $pages,
    ];

    $users = User::whereNot('id', auth()->user()->id)->get();

    $members = [];
    foreach ($users as $user) {
      $members[] = [
        'name' => $user->getFullName(),
        'subtitle' => $user->email,
        'src' => $user->profile_picture ? tenant_asset(Constants::BaseFolderEmployeeProfileWithSlash . $user->profile_picture) : null,
        'initial' => $user->getInitials(),
        'url' => 'employees/view/' . $user->id,
      ];
    }

    $response['members'] = $members;

    return response()->json($response);
  }
}
