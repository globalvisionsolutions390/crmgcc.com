/**
 * Main
 */

'use strict';

window.isRtl = window.Helpers.isRtl();
window.isDarkStyle = window.Helpers.isDarkStyle();
let menu,
  animate,
  isHorizontalLayout = false;

if (document.getElementById('layout-menu')) {
  isHorizontalLayout = document.getElementById('layout-menu').classList.contains('menu-horizontal');
}

(function () {
  setTimeout(function () {
    window.Helpers.initCustomOptionCheck();
  }, 1000);

  // Initialize menu
  //-----------------

  let layoutMenuEl = document.querySelectorAll('#layout-menu');
  layoutMenuEl.forEach(function (element) {
    menu = new Menu(element, {
      orientation: isHorizontalLayout ? 'horizontal' : 'vertical',
      closeChildren: isHorizontalLayout ? true : false,
      // ? This option only works with Horizontal menu
      showDropdownOnHover: localStorage.getItem('templateCustomizer-' + templateName + '--ShowDropdownOnHover') // If value(showDropdownOnHover) is set in local storage
        ? localStorage.getItem('templateCustomizer-' + templateName + '--ShowDropdownOnHover') === 'true' // Use the local storage value
        : window.templateCustomizer !== undefined // If value is set in config.js
          ? window.templateCustomizer.settings.defaultShowDropdownOnHover // Use the config.js value
          : true // Use this if you are not using the config.js and want to set value directly from here
    });
    // Change parameter to true if you want scroll animation
    window.Helpers.scrollToActive((animate = false));
    window.Helpers.mainMenu = menu;
  });

  // Initialize menu togglers and bind click on each
  let menuToggler = document.querySelectorAll('.layout-menu-toggle');
  menuToggler.forEach(item => {
    item.addEventListener('click', event => {
      event.preventDefault();
      window.Helpers.toggleCollapsed();
      // Enable menu state with local storage support if enableMenuLocalStorage = true from config.js
      if (config.enableMenuLocalStorage && !window.Helpers.isSmallScreen()) {
        try {
          localStorage.setItem(
            'templateCustomizer-' + templateName + '--LayoutCollapsed',
            String(window.Helpers.isCollapsed())
          );
          // Update customizer checkbox state on click of menu toggler
          let layoutCollapsedCustomizerOptions = document.querySelector('.template-customizer-layouts-options');
          if (layoutCollapsedCustomizerOptions) {
            let layoutCollapsedVal = window.Helpers.isCollapsed() ? 'collapsed' : 'expanded';
            layoutCollapsedCustomizerOptions.querySelector(`input[value="${layoutCollapsedVal}"]`).click();
          }
        } catch (e) {}
      }
    });
  });

  // Display menu toggle (layout-menu-toggle) on hover with delay
  let delay = function (elem, callback) {
    let timeout = null;
    elem.onmouseenter = function () {
      // Set timeout to be a timer which will invoke callback after 300ms (not for small screen)
      if (!Helpers.isSmallScreen()) {
        timeout = setTimeout(callback, 300);
      } else {
        timeout = setTimeout(callback, 0);
      }
    };

    elem.onmouseleave = function () {
      // Clear any timers set to timeout
      document.querySelector('.layout-menu-toggle').classList.remove('d-block');
      clearTimeout(timeout);
    };
  };
  if (document.getElementById('layout-menu')) {
    delay(document.getElementById('layout-menu'), function () {
      // not for small screen
      if (!Helpers.isSmallScreen()) {
        document.querySelector('.layout-menu-toggle').classList.add('d-block');
      }
    });
  }

  // Menu swipe gesture

  // Detect swipe gesture on the target element and call swipe In
  window.Helpers.swipeIn('.drag-target', function (e) {
    window.Helpers.setCollapsed(false);
  });

  // Detect swipe gesture on the target element and call swipe Out
  window.Helpers.swipeOut('#layout-menu', function (e) {
    if (window.Helpers.isSmallScreen()) window.Helpers.setCollapsed(true);
  });

  // Display in main menu when menu scrolls
  let menuInnerContainer = document.getElementsByClassName('menu-inner'),
    menuInnerShadow = document.getElementsByClassName('menu-inner-shadow')[0];
  if (menuInnerContainer.length > 0 && menuInnerShadow) {
    menuInnerContainer[0].addEventListener('ps-scroll-y', function () {
      if (this.querySelector('.ps__thumb-y').offsetTop) {
        menuInnerShadow.style.display = 'block';
      } else {
        menuInnerShadow.style.display = 'none';
      }
    });
  }

  // Update light/dark image based on current style
  function switchImage(style) {
    if (style === 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        style = 'dark';
      } else {
        style = 'light';
      }
    }
    const switchImagesList = [].slice.call(document.querySelectorAll('[data-app-' + style + '-img]'));
    switchImagesList.map(function (imageEl) {
      const setImage = imageEl.getAttribute('data-app-' + style + '-img');
      imageEl.src = assetsPath + 'img/' + setImage; // Using window.assetsPath to get the exact relative path
    });
  }

  //Style Switcher (Light/Dark/System Mode)
  let styleSwitcher = document.querySelector('.dropdown-style-switcher');

  // Active class on style switcher dropdown items
  const activeStyle = document.documentElement.getAttribute('data-style');

  // Get style from local storage or use 'system' as default
  let storedStyle =
    localStorage.getItem('templateCustomizer-' + templateName + '--Style') || //if no template style then use Customizer style
    (window.templateCustomizer?.settings?.defaultStyle ?? 'light'); //!if there is no Customizer then use default style as light

  // Set style on click of style switcher item if template customizer is enabled
  if (window.templateCustomizer && styleSwitcher) {
    let styleSwitcherItems = [].slice.call(styleSwitcher.children[1].querySelectorAll('.dropdown-item'));
    styleSwitcherItems.forEach(function (item) {
      item.classList.remove('active');
      item.addEventListener('click', function () {
        let currentStyle = this.getAttribute('data-theme');
        if (currentStyle === 'light') {
          window.templateCustomizer.setStyle('light');
        } else if (currentStyle === 'dark') {
          window.templateCustomizer.setStyle('dark');
        } else {
          window.templateCustomizer.setStyle('system');
        }
      });

      if (item.getAttribute('data-theme') === activeStyle) {
        // Add 'active' class to the item if it matches the activeStyle
        item.classList.add('active');
      }
    });

    // Update style switcher icon based on the stored style

    const styleSwitcherIcon = styleSwitcher.querySelector('i');

    if (storedStyle === 'light') {
      styleSwitcherIcon.classList.add('bx-sun');
      new bootstrap.Tooltip(styleSwitcherIcon, {
        title: 'Light Mode',
        fallbackPlacements: ['bottom']
      });
    } else if (storedStyle === 'dark') {
      styleSwitcherIcon.classList.add('bx-moon');
      new bootstrap.Tooltip(styleSwitcherIcon, {
        title: 'Dark Mode',
        fallbackPlacements: ['bottom']
      });
    } else {
      styleSwitcherIcon.classList.add('bx-desktop');
      new bootstrap.Tooltip(styleSwitcherIcon, {
        title: 'System Mode',
        fallbackPlacements: ['bottom']
      });
    }
  }

  // Run switchImage function based on the stored style
  switchImage(storedStyle);

  let languageDropdown = document.getElementsByClassName('dropdown-language');

  if (languageDropdown.length) {
    let dropdownItems = languageDropdown[0].querySelectorAll('.dropdown-item');
    const dropdownActiveItem = languageDropdown[0].querySelector('.dropdown-item.active');

    directionChange(dropdownActiveItem.dataset.textDirection);

    for (let i = 0; i < dropdownItems.length; i++) {
      dropdownItems[i].addEventListener('click', function () {
        let textDirection = this.getAttribute('data-text-direction');
        window.templateCustomizer.setLang(this.getAttribute('data-language'));
        directionChange(textDirection);
      });
    }

    function directionChange(textDirection) {
      if (textDirection === 'rtl') {
        if (localStorage.getItem('templateCustomizer-' + templateName + '--Rtl') !== 'true')
          window.templateCustomizer ? window.templateCustomizer.setRtl(true) : '';
      } else {
        if (localStorage.getItem('templateCustomizer-' + templateName + '--Rtl') === 'true')
          window.templateCustomizer ? window.templateCustomizer.setRtl(false) : '';
      }
    }
  }

  // add on click javascript for template customizer reset button id template-customizer-reset-btn

  setTimeout(function () {
    let templateCustomizerResetBtn = document.querySelector('.template-customizer-reset-btn');
    if (templateCustomizerResetBtn) {
      templateCustomizerResetBtn.onclick = function () {
        window.location.href = baseUrl + 'lang/en';
      };
    }
  }, 1500);

  // Notification
  // ------------
  const notificationMarkAsReadAll = document.querySelector('.dropdown-notifications-all');
  const notificationMarkAsReadList = document.querySelectorAll('.dropdown-notifications-read');

  // Notification: Mark as all as read
  if (notificationMarkAsReadAll) {
    notificationMarkAsReadAll.addEventListener('click', event => {
      notificationMarkAsReadList.forEach(item => {
        item.closest('.dropdown-notifications-item').classList.add('marked-as-read');
      });
    });
  }
  // Notification: Mark as read/unread onclick of dot
  if (notificationMarkAsReadList) {
    notificationMarkAsReadList.forEach(item => {
      item.addEventListener('click', event => {
        item.closest('.dropdown-notifications-item').classList.toggle('marked-as-read');
      });
    });
  }

  // Notification: Mark as read/unread onclick of dot
  const notificationArchiveMessageList = document.querySelectorAll('.dropdown-notifications-archive');
  notificationArchiveMessageList.forEach(item => {
    item.addEventListener('click', event => {
      item.closest('.dropdown-notifications-item').remove();
    });
  });

  // Init helpers & misc
  // --------------------

  // Init BS Tooltip
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Accordion active class
  const accordionActiveFunction = function (e) {
    if (e.type == 'show.bs.collapse' || e.type == 'show.bs.collapse') {
      e.target.closest('.accordion-item').classList.add('active');
    } else {
      e.target.closest('.accordion-item').classList.remove('active');
    }
  };

  const accordionTriggerList = [].slice.call(document.querySelectorAll('.accordion'));
  const accordionList = accordionTriggerList.map(function (accordionTriggerEl) {
    accordionTriggerEl.addEventListener('show.bs.collapse', accordionActiveFunction);
    accordionTriggerEl.addEventListener('hide.bs.collapse', accordionActiveFunction);
  });

  // If layout is RTL add .dropdown-menu-end class to .dropdown-menu
  // if (isRtl) {
  //   Helpers._addClass('dropdown-menu-end', document.querySelectorAll('#layout-navbar .dropdown-menu'));
  // }

  // Auto update layout based on screen size
  window.Helpers.setAutoUpdate(true);

  // Toggle Password Visibility
  window.Helpers.initPasswordToggle();

  // Speech To Text
  window.Helpers.initSpeechToText();

  // Init PerfectScrollbar in Navbar Dropdown (i.e notification)
  window.Helpers.initNavbarDropdownScrollbar();

  let horizontalMenuTemplate = document.querySelector("[data-template^='horizontal-menu']");
  if (horizontalMenuTemplate) {
    // if screen size is small then set navbar fixed
    if (window.innerWidth < window.Helpers.LAYOUT_BREAKPOINT) {
      window.Helpers.setNavbarFixed('fixed');
    } else {
      window.Helpers.setNavbarFixed('');
    }
  }

  // On window resize listener
  // -------------------------
  window.addEventListener(
    'resize',
    function (event) {
      // Hide open search input and set value blank
      if (window.innerWidth >= window.Helpers.LAYOUT_BREAKPOINT) {
        if (document.querySelector('.search-input-wrapper')) {
          document.querySelector('.search-input-wrapper').classList.add('d-none');
          document.querySelector('.search-input').value = '';
        }
      }
      // Horizontal Layout : Update menu based on window size
      if (horizontalMenuTemplate) {
        // if screen size is small then set navbar fixed
        if (window.innerWidth < window.Helpers.LAYOUT_BREAKPOINT) {
          window.Helpers.setNavbarFixed('fixed');
        } else {
          window.Helpers.setNavbarFixed('');
        }
        setTimeout(function () {
          if (window.innerWidth < window.Helpers.LAYOUT_BREAKPOINT) {
            if (document.getElementById('layout-menu')) {
              if (document.getElementById('layout-menu').classList.contains('menu-horizontal')) {
                menu.switchMenu('vertical');
              }
            }
          } else {
            if (document.getElementById('layout-menu')) {
              if (document.getElementById('layout-menu').classList.contains('menu-vertical')) {
                menu.switchMenu('horizontal');
              }
            }
          }
        }, 100);
      }
    },
    true
  );

  // Manage menu expanded/collapsed with templateCustomizer & local storage
  //------------------------------------------------------------------

  // If current layout is horizontal OR current window screen is small (overlay menu) than return from here
  if (isHorizontalLayout || window.Helpers.isSmallScreen()) {
    return;
  }

  // If current layout is vertical and current window screen is > small

  // Auto update menu collapsed/expanded based on the themeConfig
  if (typeof TemplateCustomizer !== 'undefined') {
    if (window.templateCustomizer.settings.defaultMenuCollapsed) {
      window.Helpers.setCollapsed(true, false);
    } else {
      window.Helpers.setCollapsed(false, false);
    }
  }

  // Manage menu expanded/collapsed state with local storage support If enableMenuLocalStorage = true in config.js
  if (typeof config !== 'undefined') {
    if (config.enableMenuLocalStorage) {
      try {
        if (localStorage.getItem('templateCustomizer-' + templateName + '--LayoutCollapsed') !== null)
          window.Helpers.setCollapsed(
            localStorage.getItem('templateCustomizer-' + templateName + '--LayoutCollapsed') === 'true',
            false
          );
      } catch (e) {}
    }
  }
})();

// ! Removed following code if you do't wish to use jQuery. Remember that navbar search functionality will stop working on removal.
if (typeof $ !== 'undefined') {
  $(function () {
    // ! TODO: Required to load after DOM is ready, did this now with jQuery ready.
    window.Helpers.initSidebarToggle();
    // Toggle Universal Sidebar

    // Navbar Search with autosuggest (typeahead)
    // ? You can remove the following JS if you don't want to use search functionality.
    //----------------------------------------------------------------------------------

    var searchToggler = $('.search-toggler'),
      searchInputWrapper = $('.search-input-wrapper'),
      searchInput = $('.search-input'),
      contentBackdrop = $('.content-backdrop');

    // Open search input on click of search icon
    if (searchToggler.length) {
      searchToggler.on('click', function () {
        if (searchInputWrapper.length) {
          searchInputWrapper.toggleClass('d-none');
          searchInput.focus();
        }
      });
    }
    // Open search on 'CTRL+/'
    $(document).on('keydown', function (event) {
      let ctrlKey = event.ctrlKey,
        slashKey = event.which === 191;

      if (ctrlKey && slashKey) {
        if (searchInputWrapper.length) {
          searchInputWrapper.toggleClass('d-none');
          searchInput.focus();
        }
      }
    });
    // Note: Following code is required to update container class of typeahead dropdown width on focus of search input. setTimeout is required to allow time to initiate Typeahead UI.
    setTimeout(function () {
      var twitterTypeahead = $('.twitter-typeahead');
      searchInput.on('focus', function () {
        if (searchInputWrapper.hasClass('container-xxl')) {
          searchInputWrapper.find(twitterTypeahead).addClass('container-xxl');
          twitterTypeahead.removeClass('container-fluid');
        } else if (searchInputWrapper.hasClass('container-fluid')) {
          searchInputWrapper.find(twitterTypeahead).addClass('container-fluid');
          twitterTypeahead.removeClass('container-xxl');
        }
      });
    }, 10);

    if (searchInput.length) {
      // Filter config
      var filterConfig = function (data) {
        return function findMatches(q, cb) {
          let matches;
          matches = [];
          data.filter(function (i) {
            if (i.name.toLowerCase().startsWith(q.toLowerCase())) {
              matches.push(i);
            } else if (
              !i.name.toLowerCase().startsWith(q.toLowerCase()) &&
              i.name.toLowerCase().includes(q.toLowerCase())
            ) {
              matches.push(i);
              matches.sort(function (a, b) {
                return b.name < a.name ? 1 : -1;
              });
            } else {
              return [];
            }
          });
          cb(matches);
        };
      };

      // Search API AJAX call
      var searchData = $.ajax({
        url: baseUrl + 'getSearchDataAjax', //? Use your own search api instead
        dataType: 'json',
        async: false
      }).responseJSON;
      // Init typeahead on searchInput
      searchInput.each(function () {
        var $this = $(this);
        searchInput
          .typeahead(
            {
              hint: false,
              classNames: {
                menu: 'tt-menu navbar-search-suggestion',
                cursor: 'active',
                suggestion: 'suggestion d-flex justify-content-between px-3 py-2 w-100'
              }
            },
            // ? Add/Update blocks as per need
            // Pages
            {
              name: 'pages',
              display: 'name',
              limit: 5,
              source: filterConfig(searchData.pages),
              templates: {
                header: '<h6 class="suggestions-header text-primary mb-0 mx-3 mt-3 pb-2">Pages</h6>',
                suggestion: function ({ url, icon, name }) {
                  return (
                    '<a href="' +
                    baseUrl +
                    url +
                    '">' +
                    '<div>' +
                    '<i class="bx ' +
                    icon +
                    ' me-2"></i>' +
                    '<span class="align-middle">' +
                    name +
                    '</span>' +
                    '</div>' +
                    '</a>'
                  );
                },
                notFound:
                  '<div class="not-found px-3 py-2">' +
                  '<h6 class="suggestions-header text-primary mb-2">Pages</h6>' +
                  '<p class="py-2 mb-0"><i class="bx bx-error-circle bx-xs me-2"></i> No Results Found</p>' +
                  '</div>'
              }
            },
            // Members
            {
              name: 'members',
              display: 'name',
              limit: 4,
              source: filterConfig(searchData.members),
              templates: {
                header: '<h6 class="suggestions-header text-primary mb-0 mx-3 mt-3 pb-2">Members</h6>',
                suggestion: function ({ name, initial, src, subtitle, url }) {
                  console.log(name, src, initial, subtitle, url);
                  if (src) {
                    return (
                      '<a href="' +
                      baseUrl +
                      url +
                      '">' +
                      '<div class="d-flex align-items-center">' +
                      '<img class="rounded-circle me-3" src="' +
                      src +
                      '" alt="' +
                      name +
                      '" height="32">' +
                      '<div class="user-info">' +
                      '<h6 class="mb-0">' +
                      name +
                      '</h6>' +
                      '<small class="text-muted">' +
                      subtitle +
                      '</small>' +
                      '</div>' +
                      '</div>' +
                      '</a>'
                    );
                  } else {
                    return (
                      '<a href="' +
                      baseUrl +
                      url +
                      '">' +
                      '<div class="d-flex align-items-center">' +
                      '<div class="avatar-wrapper">' +
                      '<div class="avatar avatar-sm me-4">' +
                      '<span class="avatar-initial rounded-circle bg-label-primary">' +
                      initial +
                      '</span>' +
                        '</div>'+
                        '</div>'+
                      '<div class="user-info">' +
                      '<h6 class="mb-0">' +
                      name +
                      '</h6>' +
                      '<small class="text-muted">' +
                      subtitle +
                      '</small>' +
                      '</div>' +
                      '</div>' +
                      '</a>'
                    );
                  }
                },
                notFound:
                  '<div class="not-found px-3 py-2">' +
                  '<h6 class="suggestions-header text-primary mb-2">Members</h6>' +
                  '<p class="py-2 mb-0"><i class="bx bx-error-circle bx-xs me-2"></i> No Results Found</p>' +
                  '</div>'
              }
            }
          )
          //On typeahead result render.
          .bind('typeahead:render', function () {
            // Show content backdrop,
            contentBackdrop.addClass('show').removeClass('fade');
          })
          // On typeahead select
          .bind('typeahead:select', function (ev, suggestion) {
            // Open selected page
            if (suggestion.url !== 'javascript:;') {
              window.location = baseUrl + suggestion.url;
            }
          })
          // On typeahead close
          .bind('typeahead:close', function () {
            // Clear search
            searchInput.val('');
            $this.typeahead('val', '');
            // Hide search input wrapper
            searchInputWrapper.addClass('d-none');
            // Fade content backdrop
            contentBackdrop.addClass('fade').removeClass('show');
          });

        // On searchInput keyup, Fade content backdrop if search input is blank
        searchInput.on('keyup', function () {
          if (searchInput.val() == '') {
            contentBackdrop.addClass('fade').removeClass('show');
          }
        });
      });

      // Init PerfectScrollbar in search result
      var psSearch;
      $('.navbar-search-suggestion').each(function () {
        psSearch = new PerfectScrollbar($(this)[0], {
          wheelPropagation: false,
          suppressScrollX: true
        });
      });

      searchInput.on('keyup', function () {
        psSearch.update();
      });
    }
  });
}
