@php
  $activationService = app()->make(\App\Services\Activation\IActivationService::class);
  $licenseInfo = $activationService->getActivationInfo();
  if(isset($licenseInfo['activation'])) {
    if(!auth()->check()){
     $pageConfigs = ['myLayout' => 'blank', 'displayCustomizer' => false];
    }
  } else {
    $pageConfigs = ['myLayout' => 'blank', 'displayCustomizer' => false];
  }
@endphp

@extends('layouts/layoutMaster')

@section('title', 'Activation')

@section('content')
  <div class="container mt-5">
    @if(isset($licenseInfo['activation']))
      <!-- Activated License Details Card -->
      <div class="card border-success mb-4">
        <div class="card-header">
          <h4 class="mb-0">Activation Details</h4>
        </div>
        <div class="card-body">
          <div class="row mt-3">
            <!-- Activation Information -->
            <div class="col-md-6">
              <h5 class="text-dark">License Information</h5>
              <ul class="list-unstyled">
                @if(!env('APP_DEMO'))
                <li><strong>Activation Code:</strong> {{ $licenseInfo['activation']['activation_code'] }}</li>
                @endif
                <li><strong>Activation Type:</strong> {{ ucfirst($licenseInfo['activation']['activation_type']) }}</li>
                <li><strong>Domain:</strong> {{ $licenseInfo['activation']['domain'] }}</li>
              </ul>
            </div>
            <!-- Status and Dates -->
            <div class="col-md-6">
              <h5 class="text-dark">Activation Status</h5>
              <ul class="list-unstyled">
                <li><strong>Status:</strong> {{ ucfirst($licenseInfo['activation']['status']) }}</li>
                <li>
                  <strong>Activated At:</strong>
                  {{ \Carbon\Carbon::parse($licenseInfo['activation']['created_at'])->format('Y-m-d H:i') }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    @else
      <!-- Activation Pending Card -->
      <div class="card border-danger mb-4">
        <div class="card-header text-center">
          <h4 class="mb-0">Activation Pending</h4>
        </div>
        <div class="card-body">
          <div class="text-center">
            <i class="bx bx-error-circle fs-1 mt-3"></i>
            <h5 class="mt-3">Your copy of {{ config('variables.templateName') }} is not activated.</h5>
            <p class="text-muted">
              Please enter your purchase code to activate.
            </p>
          </div>
          <!-- Activation Form -->
          <form action="{{ route('activation.activate') }}" method="POST" class="mt-4">
            @csrf
            <div class="row justify-content-center">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="licenseKey" class="form-label">Purchase Code <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="licenseKey" name="licenseKey" placeholder="XXXX-XXXX-XXXX-XXXX-XXXX" required>
                </div>
               <hr>
                <div class="mb-3">
                  <label class="form-label">Optional: Envato Activation</label>
                  <small class="form-text text-muted">
                    Fill these fields if you are activating with an Envato license.
                  </small>
                </div>
                <div class="mb-3">
                  <label for="envatoUsername" class="form-label">Envato Username (Optional: Envato Activation)</label>
                  <input type="text" class="form-control" id="envatoUsername" name="envato_username" placeholder="Your Envato Username">
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email Address (Optional: Envato Activation)</label>
                  <input type="email" class="form-control" id="email" name="email" placeholder="you@example.com">
                </div>
                {{-- Optionally, you may include a hidden field for activation type if you want to switch between live and localhost --}}
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary">Activate Now</button>
                </div>
              </div>
            </div>
          </form>

          <!-- Helper area for activation -->
          <div class="row mt-4">
            <div class="col-md-6 offset-md-3">
              <div class="alert alert-warning" role="alert">
                <h5 class="alert-heading">Activation Help</h5>
                <p> <a href="{{ config('variables.activationDocs') }}" target="_blank">Read the documentation</a> for more information on how to activate your copy of {{ config('variables.templateName') }}.</p>
                <p>
                  If you are having trouble activating your copy of {{ config('variables.templateName') }}, please
                  <a href="{{ config('variables.supportUrl') }}" target="_blank">contact support</a>.
                </p>
              </div>
            </div>
        </div>
      </div>
    @endif
  </div>
@endsection
