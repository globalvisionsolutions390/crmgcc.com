@php
  use Illuminate\Support\Facades\Session;
  $containerFooter = (isset($configData['contentLayout']) && $configData['contentLayout'] === 'compact') ? 'container-xxl' : 'container-fluid';
  $activationService = app()->make(\App\Services\Activation\IActivationService::class);
  $licenseStatus = \Illuminate\Support\Facades\Cache::store('file')->get('license_validity_' . config('app.url'));
@endphp

  <!-- Footer-->
<footer class="content-footer footer bg-footer-theme">
  <div class="{{ $containerFooter }}">
    <div class="footer-container d-flex align-items-center justify-content-between py-4 flex-md-row flex-column">
      <div class="text-body">
        ©
        <script>document.write(new Date().getFullYear());</script>
        , made with ❤️ by <a href="{{ (!empty(config('variables.creatorUrl')) ? config('variables.creatorUrl') : '') }}"
                             target="_blank"
                             class="footer-link">{{ (!empty(config('variables.creatorName')) ? config('variables.creatorName') : '') }}</a>
      </div>
      <div class="d-none d-lg-inline-block">
        <a href="{{route('activation.index')}}"
           data-bs-toggle="tooltip"
           class="footer-link me-4"
           title="{{$licenseStatus ? "You're running a genuine copy." : "You are running an unlicensed copy."}}">
          <span class="footer-link-text">License Status</span>
          @if($licenseStatus)
            <i class="bx bxs-check-circle text-success ms-1"></i>
          @else
            <i class="bx bxs-x-circle text-danger ms-1"></i>
          @endif
        </a>
      </div>
    </div>
  </div>
</footer>
<!--/ Footer-->
