function vehicleText(vehicle) {
  return [
    vehicle.name,
    vehicle.role,
    vehicle.career,
    vehicle.size?.en_EN,
    vehicle.type?.en_EN,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function isFighter(vehicle) {
  return /\bfighter\b|\binterceptor\b/.test(vehicleText(vehicle));
}

function isMediumOrLarger(vehicle) {
  const size = vehicle.size?.en_EN?.toLowerCase();
  const sizeClass = Number(vehicle.size_class);
  return ['medium', 'large', 'capital', 'subcapital'].includes(size)
    || (Number.isFinite(sizeClass) && sizeClass >= 3);
}

function isLargeOrCapital(vehicle) {
  const size = vehicle.size?.en_EN?.toLowerCase();
  const sizeClass = Number(vehicle.size_class);
  return ['large', 'capital', 'subcapital'].includes(size)
    || (Number.isFinite(sizeClass) && sizeClass >= 4);
}

function countOperationalTurrets(turrets, type) {
  const list = Array.isArray(turrets?.[type]) ? turrets[type] : [];
  return list.filter((turret) => {
    if (type === 'pdc') return false;
    if (type === 'remote') {
      return (turret.weapons?.length ?? 0) > 0
        || (turret.payload_sizes?.length ?? 0) > 0
        || /turret/i.test(turret.display_name ?? '');
    }
    return true;
  }).length;
}

function template(profileKey, roleType, label, required, minCount, maxCount, sortOrder, canTransitionToFps = false) {
  return {
    staffingProfileKey: profileKey,
    roleType,
    label,
    required,
    minCount,
    maxCount,
    canTransitionToFps,
    sortOrder,
  };
}

function addPilot(templates, profileKey) {
  templates.push(template(profileKey, 'pilot', 'Pilot', true, 1, 1, 10));
}

export function deriveTemplatesForVehicle(vehicle) {
  const templates = [];
  const mannedTurretCount = countOperationalTurrets(vehicle.turrets, 'manned');
  const remoteTurretCount = countOperationalTurrets(vehicle.turrets, 'remote');
  const fighter = isFighter(vehicle);
  const mediumOrLarger = isMediumOrLarger(vehicle);
  const largeOrCapital = isLargeOrCapital(vehicle);

  for (const profileKey of ['skeleton', 'standard', 'full_crew']) {
    addPilot(templates, profileKey);
  }

  if (mannedTurretCount > 0) {
    templates.push(template('standard', 'turret_gunner', 'Turret Gunner', true, mannedTurretCount, mannedTurretCount, 20));
    templates.push(template('full_crew', 'turret_gunner', 'Turret Gunner', true, mannedTurretCount, mannedTurretCount, 20));
  }

  if (remoteTurretCount > 0) {
    const standardRequired = fighter;
    templates.push(template(
      'standard',
      'remote_turret_gunner',
      'Remote Turret Gunner',
      standardRequired,
      standardRequired ? remoteTurretCount : 0,
      remoteTurretCount,
      30,
    ));
    templates.push(template('full_crew', 'remote_turret_gunner', 'Remote Turret Gunner', true, remoteTurretCount, remoteTurretCount, 30));
  }

  if (mediumOrLarger && !fighter) {
    templates.push(template('standard', 'engineer', 'Engineer', false, 0, 1, 40));
  }

  if (mediumOrLarger && !fighter) {
    templates.push(template('full_crew', 'engineer', 'Engineer', true, 1, largeOrCapital ? 3 : 1, 40));
  }

  if (largeOrCapital && !fighter) {
    templates.push(template('full_crew', 'medic', 'Medic Team', false, 0, 3, 50, true));
    templates.push(template('full_crew', 'marine', 'Marine Team', false, 0, 8, 60, true));
  }

  return templates;
}
