import IpAccess from '../models/ipAccess.js';

export async function hasUsedTrial(ip) {
  const record = await IpAccess.findByPk(ip);
  return record?.used === true;
}

export async function markTrialUsed(ip) {
  await IpAccess.upsert({ ip, used: true });
}