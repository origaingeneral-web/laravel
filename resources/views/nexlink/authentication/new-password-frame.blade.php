<!DOCTYPE html>
<html lang="en">


<!-- Mirrored from nexlink.layoutdrop.com/demo/authentication/new-password-frame.html by HTTrack Website Copier/3.x [XR&CO'2014], Sat, 11 Jul 2026 06:45:50 GMT -->
<head>

  <base href="{{ url('/nexlink') }}/">

  <!-- begin::NexLink Meta Basic -->
  <meta charset="utf-8">
  <meta name="theme-color" content="#5955D1">
  <meta name="robots" content="index, follow">
  <meta name="author" content="LayoutDrop">
  <meta name="format-detection" content="telephone=no">
  <meta name="keywords" content="Bootstrap Admin Template, CRM Dashboard, Admin Panel, Bootstrap 5 Dashboard, Project Management, Analytics Template, Responsive Admin">
  <meta name="description" content="NexLink is a modern Bootstrap 5 CRM Admin Dashboard Template designed for managing sales, analytics, projects, and team performance with clean UI, responsive layout, and prebuilt pages.">
  <!-- end::NexLink Meta Basic -->

  <!-- begin::NexLink Meta Social -->
  <meta property="og:url" content="../index-2.html">
  <meta property="og:site_name" content="NexLink | CRM Admin Dashboard Template">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="NexLink | CRM Admin Dashboard Template">
  <meta property="og:description" content="NexLink is a modern Bootstrap 5 CRM Admin Dashboard Template designed for managing sales, analytics, projects, and team performance with clean UI, responsive layout, and prebuilt pages.">
  <meta property="og:image" content="../preview.png">
  <!-- end::NexLink Meta Social -->

  <!-- begin::NexLink Meta Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:url" content="../index-2.html">
  <meta name="twitter:creator" content="@layoutdrop">
  <meta name="twitter:title" content="NexLink | CRM Admin Dashboard Template">
  <meta name="twitter:description" content="NexLink is a modern Bootstrap 5 CRM Admin Dashboard Template designed for managing sales, analytics, projects, and team performance with clean UI, responsive layout, and prebuilt pages.">
  <!-- end::NexLink Meta Twitter -->

  <!-- begin::NexLink Website Page Title -->
  <title>NexLink | CRM Admin Dashboard Template</title>
  <!-- end::NexLink Website Page Title -->

  <!-- begin::NexLink Mobile Specific -->
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <!-- end::NexLink Mobile Specific -->

  <!-- begin::NexLink Favicon Tags -->
  <link rel="icon" type="image/png" href="{{ asset('nexlink/assets/images/favicon.png') }}">
  <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('nexlink/assets/images/apple-touch-icon.png') }}">
  <!-- end::NexLink Favicon Tags -->

  <!-- begin::NexLink Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com/">
  <link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&amp;display=swap" rel="stylesheet">
  <!-- end::NexLink Google Fonts -->

  <!-- begin::NexLink Required Stylesheet -->
  <link rel="stylesheet" href="{{ asset('nexlink/assets/libs/flaticon/css/all/all.css') }}">
  <link rel="stylesheet" href="{{ asset('nexlink/assets/libs/lucide/lucide.css') }}">
  <link rel="stylesheet" href="{{ asset('nexlink/assets/libs/fontawesome/css/all.min.css') }}">
  <link rel="stylesheet" href="{{ asset('nexlink/assets/libs/simplebar/simplebar.css') }}">
  <link rel="stylesheet" href="{{ asset('nexlink/assets/libs/node-waves/waves.css') }}">
  <link rel="stylesheet" href="{{ asset('nexlink/assets/libs/bootstrap-select/css/bootstrap-select.min.css') }}">
  <!-- end::NexLink Required Stylesheet -->

  <!-- begin::NexLink CSS Stylesheet -->
  <link rel="stylesheet" href="{{ asset('nexlink/assets/css/styles.css') }}">
  <!-- end::NexLink CSS Stylesheet -->



</head>

<body>
  <div class="page-layout">

    <div class="auth-frame-wrapper">
      <div class="row g-0 h-100">
        <div class="col-xl-8 col-lg-7 col-md-6">
          <div class="auth-frame" style="background-image: url({{ asset('nexlink/assets/images/auth/auth-frame.webp') }});"></div>
        </div>
        <div class="col-xl-4 col-lg-5 col-md-6 align-self-center">
          <div class="p-4 p-sm-5 maxw-450px m-auto">
            <div class="mb-4 text-center">
              <a href="{{ url('/nexlink') }}" aria-label="NexLink logo">
                <img class="visible-light" src="{{ asset('nexlink/assets/images/logo.svg') }}" alt="NexLink logo">
              </a>
            </div>
            <div class="text-center mb-5">
              <h5 class="mb-1">Welcome to NexLink</h5>
              <p>Enter your email to reset your password.</p>
            </div>
            <form action="{{ url('/nexlink/authentication/login-frame') }}">
              <div class="mb-4">
                <label class="form-label" for="newPassword">New Password</label>
                <div class="password-wrapper">
                  <input type="password" class="form-control" id="newPassword" placeholder="********">
                  <button type="button" class="toggle-password" aria-pressed="false" aria-label="Show password" title="Show password">
                    <i class="close fi fi-rr-eye-crossed" aria-hidden="true"></i>
                    <i class="open fi fi-rr-eye" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label" for="confirmPassword">Confirm Password</label>
                <div class="password-wrapper">
                  <input type="password" class="form-control" id="confirmPassword" placeholder="********">
                  <button type="button" class="toggle-password" aria-pressed="false" aria-label="Show password" title="Show password">
                    <i class="close fi fi-rr-eye-crossed" aria-hidden="true"></i>
                    <i class="open fi fi-rr-eye" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
              <div class="mb-4">
                <div class="form-check mb-0">
                  <input class="form-check-input" type="checkbox" id="termsConditions" name="terms">
                  <label class="form-check-label" for="termsConditions">
                    I Agree & <a href="javascript:void(0);">Terms and conditions.</a>
                  </label>
                </div>
              </div>
              <div class="clearfix">
                <button type="submit" value="Submit" class="btn btn-primary waves-effect waves-light w-100 mb-3">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

  </div>
  <!-- begin::NexLink Page Scripts -->
  <script src="{{ asset('nexlink/assets/libs/global/global.min.js') }}"></script>
  <script src="{{ asset('nexlink/assets/js/appSettings.js') }}"></script>
  <script src="{{ asset('nexlink/assets/js/main.js') }}"></script>
  <!-- end::NexLink Page Scripts -->
</body>


<!-- Mirrored from nexlink.layoutdrop.com/demo/authentication/new-password-frame.html by HTTrack Website Copier/3.x [XR&CO'2014], Sat, 11 Jul 2026 06:45:50 GMT -->
</html>