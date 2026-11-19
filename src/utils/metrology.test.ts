import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMeterError, computeHydraulicState, getToleranceForRegime } from './metrology';

test('computeHydraulicState returns IDLE when pump is off regardless of valve state', () => {
  const closedState = computeHydraulicState({
    pumpOn: false,
    ballValveOpen: false,
    regime: 'Q3',
  });
  assert.equal(closedState.statusCode, 'IDLE');
  assert.equal(closedState.flowRateLph, 0);
  assert.equal(closedState.downstreamActive, false);

  const openState = computeHydraulicState({
    pumpOn: false,
    ballValveOpen: true,
    regime: 'Q1',
  });
  assert.equal(openState.statusCode, 'IDLE');
  assert.equal(openState.flowRateLph, 0);
});

test('computeHydraulicState returns BLOCKED when pump is on and ball valve is closed', () => {
  const blocked = computeHydraulicState({
    pumpOn: true,
    ballValveOpen: false,
    regime: 'Q2',
  });
  assert.equal(blocked.statusCode, 'BLOCKED');
  assert.equal(blocked.suctionActive, true);
  assert.equal(blocked.upstreamActive, true);
  assert.equal(blocked.downstreamActive, false);
  assert.equal(blocked.returnActive, false);
  assert.equal(blocked.flowRateLph, 0);
  assert.ok(blocked.pressureBar > 2.0);
});

test('computeHydraulicState returns accurate flow rates for Q1, Q2, and Q3 when flowing', () => {
  const q1 = computeHydraulicState({ pumpOn: true, ballValveOpen: true, regime: 'Q1' });
  const q2 = computeHydraulicState({ pumpOn: true, ballValveOpen: true, regime: 'Q2' });
  const q3 = computeHydraulicState({ pumpOn: true, ballValveOpen: true, regime: 'Q3' });

  assert.equal(q1.statusCode, 'FLOWING');
  assert.equal(q1.flowRateLph, 32);
  assert.equal(q2.flowRateLph, 50);
  assert.equal(q3.flowRateLph, 2500);
  assert.equal(q3.downstreamActive, true);
  assert.equal(q3.returnActive, true);
});

test('getToleranceForRegime follows SNI/OIML ±5% for Q1 and ±2% for Q2/Q3', () => {
  assert.equal(getToleranceForRegime('Q1'), 5.0);
  assert.equal(getToleranceForRegime('Q2'), 2.0);
  assert.equal(getToleranceForRegime('Q3'), 2.0);
});

test('calculateMeterError evaluates positive, negative, boundary, and invalid volumes', () => {
  const failQ3 = calculateMeterError({ testedVolumeL: 102.5, masterVolumeL: 100, regime: 'Q3' });
  assert.equal(failQ3.valid, true);
  assert.equal(failQ3.errorPercent, 2.5);
  assert.equal(failQ3.isWithinTolerance, false);
  assert.equal(failQ3.statusLabel, 'PERLU KALIBRASI');

  const passQ3 = calculateMeterError({ testedVolumeL: 98.5, masterVolumeL: 100, regime: 'Q3' });
  assert.equal(passQ3.valid, true);
  assert.equal(passQ3.errorPercent, -1.5);
  assert.equal(passQ3.isWithinTolerance, true);
  assert.equal(passQ3.statusLabel, 'LULUS UJI');

  const passQ1Boundary = calculateMeterError({ testedVolumeL: 9.5, masterVolumeL: 10, regime: 'Q1' });
  assert.equal(passQ1Boundary.errorPercent, -5);
  assert.equal(passQ1Boundary.isWithinTolerance, true);

  const invalidMaster = calculateMeterError({ testedVolumeL: 10, masterVolumeL: 0, regime: 'Q2' });
  assert.equal(invalidMaster.valid, false);
  assert.equal(invalidMaster.statusLabel, 'INPUT TIDAK VALID');
});
