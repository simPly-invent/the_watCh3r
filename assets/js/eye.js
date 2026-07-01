(function () {
  'use strict';

  var overlay   = document.getElementById('eye-overlay');
  var openGroup = document.getElementById('eye-open-group');
  var irisGroup = document.getElementById('overlay-iris-group');
  var logoGroup = document.getElementById('logo-open-group');

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  // Animate scaleY of an SVG group around its center (100,100 in viewBox)
  function animScaleY(group, from, to, dur, cb) {
    var t0 = performance.now();
    function frame(now) {
      var t = Math.min((now - t0) / dur, 1);
      var s = from + (to - from) * easeOutCubic(t);
      group.setAttribute('transform',
        'translate(100,100) scale(1,' + s + ') translate(-100,-100)');
      if (t < 1) requestAnimationFrame(frame);
      else if (cb) cb();
    }
    requestAnimationFrame(frame);
  }

  // Animate iris translateX in SVG viewBox units
  function animTransX(from, to, dur, cb) {
    var t0 = performance.now();
    function frame(now) {
      var t = Math.min((now - t0) / dur, 1);
      var x = from + (to - from) * easeInOut(t);
      irisGroup.setAttribute('transform', 'translate(' + x + ',0)');
      if (t < 1) requestAnimationFrame(frame);
      else if (cb) cb();
    }
    requestAnimationFrame(frame);
  }

  // center → left → center → right → center
  function lookSequence(cb) {
    animTransX(0, -18, 380, function () {
      setTimeout(function () {
        animTransX(-18, 0, 320, function () {
          setTimeout(function () {
            animTransX(0, 18, 380, function () {
              setTimeout(function () {
                animTransX(18, 0, 320, function () {
                  if (cb) cb();
                });
              }, 500);
            });
          }, 300);
        });
      }, 500);
    });
  }

  // INTRO : écran noir, oeil s'ouvre, overlay disparaît
  function intro() {
    openGroup.setAttribute('transform',
      'translate(100,100) scale(1,0.015) translate(-100,-100)');
    if (logoGroup) {
      logoGroup.setAttribute('transform',
        'translate(100,100) scale(1,0.015) translate(-100,-100)');
    }
    irisGroup.setAttribute('transform', 'translate(0,0)');

    overlay.style.transition = 'none';
    overlay.style.opacity    = '1';
    overlay.style.display    = 'flex';

    setTimeout(function () {
      // Ouvrir l'oeil (et le logo en sync)
      animScaleY(openGroup, 0.015, 1, 1400, null);
      if (logoGroup) animScaleY(logoGroup, 0.015, 1, 1400, null);

      // Fade-out de l'overlay après l'animation
      setTimeout(function () {
        overlay.style.transition = 'opacity 0.7s ease';
        overlay.style.opacity = '0';
        setTimeout(function () { overlay.style.display = 'none'; }, 700);
      }, 1800);
    }, 300);
  }

  // REGARD (toutes les 20s) : overlay semi-transparent, oeil regarde G/D
  function periodicLook() {
    openGroup.setAttribute('transform',
      'translate(100,100) scale(1,1) translate(-100,-100)');
    irisGroup.setAttribute('transform', 'translate(0,0)');

    overlay.style.pointerEvents = 'none';
    overlay.style.transition    = 'none';
    overlay.style.opacity       = '0';
    overlay.style.display       = 'flex';

    // Double rAF pour déclencher la transition après display:flex
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.opacity    = '0.88';

        setTimeout(function () {
          lookSequence(function () {
            setTimeout(function () {
              overlay.style.transition = 'opacity 0.7s ease';
              overlay.style.opacity    = '0';
              setTimeout(function () { overlay.style.display = 'none'; }, 700);
            }, 300);
          });
        }, 600);
      });
    });
  }

  intro();
  setInterval(periodicLook, 20000);

}());
