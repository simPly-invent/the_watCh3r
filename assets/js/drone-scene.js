/* Three.js procedural drone scene — hero canvas animation */
(function () {
  const canvas = document.getElementById('drone-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  /* ── Scene & Camera ── */
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050508, 0.12);

  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.set(0, 1.4, 4.8);
  camera.lookAt(0, 0.2, 0);

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ── Lighting ── */
  scene.add(new THREE.AmbientLight(0x0d1a33, 3));

  const keyLight = new THREE.DirectionalLight(0x00d4ff, 4);
  keyLight.position.set(3, 4, 2);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0x8b5cf6, 5, 10);
  fillLight.position.set(-3, 0.5, -1);
  scene.add(fillLight);

  const rimLight = new THREE.PointLight(0x00d4ff, 2, 6);
  rimLight.position.set(0, -1.5, 2);
  scene.add(rimLight);

  /* ── Materials ── */
  const matBody = new THREE.MeshPhongMaterial({ color: 0x12121e, shininess: 90, specular: 0x00d4ff });
  const matArm  = new THREE.MeshPhongMaterial({ color: 0x1a1a2e, shininess: 60 });
  const matAccent = new THREE.MeshPhongMaterial({ color: 0x00d4ff, emissive: 0x002233, shininess: 220 });
  const matDark = new THREE.MeshPhongMaterial({ color: 0x0a0a18, shininess: 30 });
  const matLedG = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
  const matLedR = new THREE.MeshBasicMaterial({ color: 0xff3333 });

  /* ── Drone Group ── */
  const drone = new THREE.Group();

  /* Body */
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.1, 0.38), matBody);
  body.castShadow = true;
  drone.add(body);

  /* Battery on top */
  const batt = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.07, 0.2), matDark);
  batt.position.set(0, 0.085, 0);
  drone.add(batt);

  /* Camera dome on bottom */
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    matAccent
  );
  dome.position.set(0.08, -0.1, 0);
  dome.castShadow = true;
  drone.add(dome);

  /* Body edge glow lines */
  const bodyEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(0.55, 0.1, 0.38)),
    new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.25 })
  );
  drone.add(bodyEdges);

  /* Antenna */
  const ant = new THREE.Mesh(
    new THREE.CylinderGeometry(0.005, 0.005, 0.22, 6),
    new THREE.MeshPhongMaterial({ color: 0x666688 })
  );
  ant.position.set(-0.18, 0.175, 0.1);
  ant.rotation.z = 0.18;
  drone.add(ant);

  /* ── Arms + Rotors ── */
  const ARM_LENGTH = 0.72;
  const rotorGroups = [];

  [Math.PI / 4, -Math.PI / 4, 3 * Math.PI / 4, -3 * Math.PI / 4].forEach((angle, i) => {
    const armGroup = new THREE.Group();
    armGroup.rotation.y = angle;

    /* Arm beam — offset so it starts at drone center and extends outward */
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(ARM_LENGTH, 0.04, 0.04),
      i < 2 ? matArm : matDark
    );
    beam.position.x = ARM_LENGTH / 2;
    beam.castShadow = true;
    armGroup.add(beam);

    /* Motor mount at arm tip */
    const mount = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.07, 0.07, 12),
      matAccent
    );
    mount.position.x = ARM_LENGTH;
    armGroup.add(mount);

    /* Rotor group (spinning) */
    const rg = new THREE.Group();
    rg.position.x = ARM_LENGTH;
    rg.position.y = 0.045;

    const blade1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.007, 0.038),
      new THREE.MeshPhongMaterial({ color: 0x2a3a4a, transparent: true, opacity: 0.7 })
    );
    const blade2 = blade1.clone();
    blade2.rotation.y = Math.PI / 2;
    rg.add(blade1, blade2);

    /* Rotor ring */
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.013, 8, 32),
      new THREE.MeshPhongMaterial({ color: 0x00d4ff, emissive: 0x001122, transparent: true, opacity: 0.65 })
    );
    ring.rotation.x = Math.PI / 2;
    rg.add(ring);

    armGroup.add(rg);
    rotorGroups.push(rg);

    /* LED at tip */
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), i < 2 ? matLedG : matLedR);
    led.position.set(ARM_LENGTH, -0.025, 0);
    armGroup.add(led);

    drone.add(armGroup);
  });

  drone.position.y = 0;
  scene.add(drone);

  /* ── Grid floor ── */
  const grid = new THREE.GridHelper(12, 24, 0x00d4ff, 0x0d1a33);
  grid.position.y = -2.2;
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  scene.add(grid);

  /* ── Particle field (thrust effect) ── */
  const PARTICLE_COUNT = 100;
  const pPositions = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pPositions[i * 3]     = (Math.random() - 0.5) * 2.5;
    pPositions[i * 3 + 1] = -0.3 - Math.random() * 2;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.025,
    transparent: true,
    opacity: 0.35
  }));
  drone.add(particles);

  /* ── Mouse parallax ── */
  let targetX = 0, targetZ = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ── Rotor direction per arm (alternating for realism) ── */
  const rotorDir = [1, -1, -1, 1];

  /* ── Animation loop ── */
  let t = 0;

  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;

    /* Hover */
    drone.position.y = Math.sin(t * 0.75) * 0.14;

    /* Gentle attitude shifts */
    drone.rotation.x = Math.sin(t * 0.48) * 0.05;
    drone.rotation.z = Math.cos(t * 0.61) * 0.04;

    /* Mouse parallax — smooth follow */
    targetX += (mouseX * 0.55 - targetX) * 0.04;
    targetZ += (mouseY * 0.28 - targetZ) * 0.04;
    drone.rotation.y = targetX;
    drone.rotation.x += targetZ * 0.12;

    /* Auto slow spin when no mouse */
    if (Math.abs(mouseX) < 0.02) drone.rotation.y += 0.004;

    /* Spin rotors */
    rotorGroups.forEach((rg, i) => {
      rg.rotation.y += 0.38 * rotorDir[i];
    });

    /* Animate particles downward (thrust) */
    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 1] -= 0.009;
      if (pos[i * 3 + 1] < -2.5) {
        pos[i * 3]     = (Math.random() - 0.5) * 2.5;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
      }
    }
    pGeo.attributes.position.needsUpdate = true;

    /* Orbit fill light for dynamic shading */
    fillLight.position.x = Math.sin(t * 0.6) * 4;
    fillLight.position.z = Math.cos(t * 0.6) * 4;

    renderer.render(scene, camera);
  }

  animate();
})();
