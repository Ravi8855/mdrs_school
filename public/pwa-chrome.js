/**
 * PWA shell: install prompt, offline UX, SW update popup, native-style feedback.
 * Loaded from index.html only — no React dependency.
 */
;(function () {
  'use strict'

  var INSTALL_DISMISS_SESSION = 'mdrs_pwa_install_dismissed_session'
  var UPDATE_DISMISS_SESSION = 'mdrs_pwa_update_dismissed_session'

  var offlineFlashTimer = null
  var lastOfflineToast = 0
  var installAutoTimer = null
  var wasOffline = typeof navigator !== 'undefined' ? !navigator.onLine : false

  function $(id) {
    return document.getElementById(id)
  }

  function prefersReducedMotion() {
    return (
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }

  function triggerHaptic() {
    if (prefersReducedMotion()) return
    var vib = navigator.vibrate
    var used = false
    if (typeof vib === 'function') {
      try {
        used = !!vib.call(navigator, 16)
      } catch (e) {}
    }
    if (!used) {
      document.documentElement.classList.add('pwa-chrome-haptic-flash')
      setTimeout(function () {
        document.documentElement.classList.remove('pwa-chrome-haptic-flash')
      }, 180)
    }
  }

  function clearInstallAutoTimer() {
    if (installAutoTimer) {
      clearTimeout(installAutoTimer)
      installAutoTimer = null
    }
  }

  function scheduleInstallAutoHide() {
    if (prefersReducedMotion()) return
    clearInstallAutoTimer()
    installAutoTimer = setTimeout(function () {
      var b = $('pwa-install-banner')
      if (b && b.classList.contains('pwa-chrome--visible')) hideInstallBanner()
    }, 10000)
  }

  /* ---------- Install ---------- */
  var deferredPrompt = null

  function hideInstallBanner() {
    clearInstallAutoTimer()
    var el = $('pwa-install-banner')
    if (!el) return
    el.classList.remove('pwa-chrome--visible')
    setTimeout(function () {
      el.hidden = true
      el.setAttribute('aria-hidden', 'true')
    }, 340)
  }

  function showInstallBanner() {
    try {
      if (sessionStorage.getItem(INSTALL_DISMISS_SESSION) === '1') return
    } catch (e) {}
    var el = $('pwa-install-banner')
    if (!el) return
    el.hidden = false
    el.setAttribute('aria-hidden', 'false')
    el.offsetHeight
    el.classList.add('pwa-chrome--visible')
    scheduleInstallAutoHide()
  }

  function bindInstallEngagement(el) {
    function pauseTimer() {
      clearInstallAutoTimer()
    }
    function resumeTimer() {
      scheduleInstallAutoHide()
    }
    el.addEventListener('mouseenter', pauseTimer)
    el.addEventListener('mouseleave', resumeTimer)
    el.addEventListener('touchstart', pauseTimer, { passive: true })
    el.addEventListener('touchend', function () {
      setTimeout(resumeTimer, 400)
    })
    el.addEventListener('focusin', pauseTimer)
    el.addEventListener('focusout', resumeTimer)
  }

  function initInstall() {
    var banner = $('pwa-install-banner')
    if (banner) bindInstallEngagement(banner)

    window.addEventListener(
      'beforeinstallprompt',
      function (e) {
        e.preventDefault()
        deferredPrompt = e
        showInstallBanner()
      },
      { passive: false },
    )

    window.addEventListener('appinstalled', function () {
      deferredPrompt = null
      hideInstallBanner()
    })

    var btn = $('pwa-install-btn')
    var dismiss = $('pwa-install-dismiss')
    if (btn) {
      btn.addEventListener('click', function () {
        if (!deferredPrompt) return
        triggerHaptic()
        var ev = deferredPrompt
        ev.prompt()
        ev.userChoice
          .then(function () {
            deferredPrompt = null
            hideInstallBanner()
          })
          .catch(function () {
            deferredPrompt = null
            hideInstallBanner()
          })
      })
    }
    if (dismiss) {
      dismiss.addEventListener('click', function () {
        try {
          sessionStorage.setItem(INSTALL_DISMISS_SESSION, '1')
        } catch (e) {}
        hideInstallBanner()
      })
    }
  }

  /* ---------- Offline + flash toasts ---------- */
  function setOfflineBar(online) {
    var bar = $('pwa-offline-bar')
    if (!bar) return
    if (online) {
      bar.classList.remove('pwa-chrome--visible')
      setTimeout(function () {
        bar.hidden = true
      }, 300)
    } else {
      bar.hidden = false
      bar.offsetHeight
      bar.classList.add('pwa-chrome--visible')
    }
  }

  function showChromeFlash(msg, durationMs, success) {
    var el = $('pwa-offline-flash')
    if (!el) return
    var now = Date.now()
    if (!success && now - lastOfflineToast < 3200) return
    if (!success) lastOfflineToast = now
    el.textContent = msg
    el.classList.toggle('pwa-chrome--success', !!success)
    el.hidden = false
    el.offsetHeight
    el.classList.add('pwa-chrome--visible')
    if (offlineFlashTimer) clearTimeout(offlineFlashTimer)
    offlineFlashTimer = setTimeout(function () {
      el.classList.remove('pwa-chrome--visible')
      setTimeout(function () {
        el.hidden = true
        el.textContent = ''
        el.classList.remove('pwa-chrome--success')
      }, 320)
    }, durationMs || 2800)
  }

  function initOffline() {
    function sync() {
      var online = navigator.onLine
      if (online && wasOffline) {
        showChromeFlash('Back online', 2000, true)
      }
      wasOffline = !online
      setOfflineBar(online)
    }
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    sync()

    document.addEventListener(
      'click',
      function (e) {
        if (navigator.onLine) return
        var t = e.target
        if (!t || !t.closest) return
        if (t.closest('#pwa-install-banner, #pwa-update-toast, #pwa-offline-flash, #pwa-offline-bar')) return
        if (t.closest('input, textarea, select, option, [contenteditable="true"], label')) return
        if (t.closest('a, button, [role="button"], input[type="submit"], input[type="button"], input[type="reset"]')) {
          showChromeFlash("You're offline", 2600, false)
        }
      },
      true,
    )
  }

  /* ---------- Service worker update ---------- */
  function initUpdate() {
    if (!('serviceWorker' in navigator)) return

    var reloadOnceLock = false
    function reloadOnce() {
      if (reloadOnceLock) return
      reloadOnceLock = true
      window.location.reload()
    }
    navigator.serviceWorker.addEventListener('controllerchange', reloadOnce)

    function triggerReload() {
      setTimeout(reloadOnce, 2000)
    }

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return
      navigator.serviceWorker.getRegistration().then(function (reg) {
        if (reg) reg.update()
      })
    })

    var toast = $('pwa-update-toast')
    var btn = $('pwa-update-toast-refresh')
    var dismiss = $('pwa-update-toast-dismiss')
    if (!toast || !btn) return

    var bound = false
    var updateTriggered = false
    var updateAutoTimer = null
    var updateCountdownTimer = null
    var updateDefaultMsg = ''
    var waitingWorker = null

    function getUpdateMsgEl() {
      return toast.querySelector('.pwa-update-toast__msg')
    }

    function clearUpdateAutoTimers() {
      if (updateAutoTimer) {
        clearTimeout(updateAutoTimer)
        updateAutoTimer = null
      }
      if (updateCountdownTimer) {
        clearInterval(updateCountdownTimer)
        updateCountdownTimer = null
      }
    }

    function restoreUpdateToastMessage() {
      var msgEl = getUpdateMsgEl()
      if (msgEl && updateDefaultMsg) msgEl.textContent = updateDefaultMsg
    }

    function setUpdateCountdownLabel(secondsLeft) {
      var msgEl = getUpdateMsgEl()
      if (!msgEl) return
      if (!updateDefaultMsg) updateDefaultMsg = msgEl.textContent || ''
      if (secondsLeft < 1) {
        msgEl.textContent = updateDefaultMsg
        return
      }
      msgEl.textContent =
        'Updating automatically in ' +
        secondsLeft +
        ' second' +
        (secondsLeft === 1 ? '' : 's') +
        '…'
    }

    function scheduleAutoUpdate() {
      clearUpdateAutoTimers()
      if (updateTriggered) return
      if (!waitingWorker) return
      try {
        if (sessionStorage.getItem(UPDATE_DISMISS_SESSION) === '1') return
      } catch (e) {}

      var msgEl = getUpdateMsgEl()
      if (msgEl && !updateDefaultMsg) updateDefaultMsg = msgEl.textContent || ''

      var totalSec = 5
      var remaining = totalSec
      setUpdateCountdownLabel(remaining)

      updateCountdownTimer = setInterval(function () {
        if (updateTriggered) return
        remaining -= 1
        if (remaining < 1) {
          clearInterval(updateCountdownTimer)
          updateCountdownTimer = null
          return
        }
        setUpdateCountdownLabel(remaining)
      }, 1000)

      updateAutoTimer = setTimeout(function () {
        updateAutoTimer = null
        if (updateCountdownTimer) {
          clearInterval(updateCountdownTimer)
          updateCountdownTimer = null
        }
        if (updateTriggered) return
        if (!waitingWorker) return
        try {
          if (sessionStorage.getItem(UPDATE_DISMISS_SESSION) === '1') return
        } catch (e) {}

        if (!updateTriggered && waitingWorker) {
          updateTriggered = true
          console.log('Auto update triggered')
          waitingWorker.postMessage({ type: 'SKIP_WAITING' })
          triggerReload()
        }
      }, 5000)
    }

    function hideUpdate() {
      clearUpdateAutoTimers()
      toast.classList.remove('pwa-update-toast--visible', 'pwa-update-toast--ready')
      setTimeout(function () {
        toast.hidden = true
        toast.setAttribute('aria-hidden', 'true')
      }, 340)
    }

    function showUpdate() {
      try {
        if (sessionStorage.getItem(UPDATE_DISMISS_SESSION) === '1') return
      } catch (e) {}
      toast.hidden = false
      toast.setAttribute('aria-hidden', 'false')
      toast.offsetHeight
      toast.classList.add('pwa-update-toast--visible')
      setTimeout(function () {
        toast.classList.add('pwa-update-toast--ready')
      }, 400)
    }

    function wire() {
      if (bound) return
      bound = true
      btn.addEventListener('click', function () {
        if (updateTriggered) return
        clearUpdateAutoTimers()
        restoreUpdateToastMessage()
        if (!waitingWorker) return
        updateTriggered = true
        triggerHaptic()
        waitingWorker.postMessage({ type: 'SKIP_WAITING' })
        triggerReload()
      })
    }

    if (dismiss) {
      dismiss.addEventListener('click', function () {
        try {
          sessionStorage.setItem(UPDATE_DISMISS_SESSION, '1')
        } catch (e) {}
        hideUpdate()
      })
    }

    function onWaiting(reg) {
      if (!reg.waiting || !navigator.serviceWorker.controller) return
      try {
        if (sessionStorage.getItem(UPDATE_DISMISS_SESSION) === '1') return
      } catch (e) {}
      if (updateTriggered) return
      waitingWorker = reg.waiting
      console.log('Update detected')
      console.log('Waiting worker:', waitingWorker)
      showUpdate()
      wire()
      scheduleAutoUpdate()
    }

    function attach(reg) {
      if (!reg) return
      onWaiting(reg)
      reg.addEventListener('updatefound', function () {
        var iw = reg.installing
        if (!iw) return
        iw.addEventListener('statechange', function () {
          if (iw.state !== 'installed') return
          if (reg.waiting) {
            waitingWorker = reg.waiting
            console.log('Waiting worker:', waitingWorker)
          }
          onWaiting(reg)
        })
      })
    }

    window.addEventListener('load', function () {
      navigator.serviceWorker.getRegistration().then(attach)
    })
  }

  /* ---------- Root mount ---------- */
  function initRootFade() {
    var root = $('root')
    if (!root || typeof MutationObserver === 'undefined') return
    if (root.childElementCount > 0) {
      root.classList.add('pwa-root--mounted')
      return
    }
    var mo = new MutationObserver(function () {
      if (root.childElementCount > 0) {
        root.classList.add('pwa-root--mounted')
        mo.disconnect()
      }
    })
    mo.observe(root, { childList: true })
  }

  function boot() {
    initInstall()
    initOffline()
    initUpdate()
    initRootFade()
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
  else boot()
})()
