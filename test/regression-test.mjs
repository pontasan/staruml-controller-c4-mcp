#!/usr/bin/env node
import { apiGet, apiPost, apiDelete, encId, runTest } from './test-utils.mjs';

const DIR = import.meta.dirname;

await runTest('c4', DIR, async (ctx) => {
  let s = ctx.step('Create C4 diagram');
  let diagramId;
  try {
    const res = await apiPost('/api/c4/diagrams', { name: 'Test C4' });
    diagramId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create person');
  let personId;
  try {
    const res = await apiPost('/api/c4/elements', { diagramId, type: 'C4Person', name: 'User', description: 'End user', x1: 50, y1: 50, x2: 200, y2: 150 });
    personId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create software system');
  let sysId;
  try {
    const res = await apiPost('/api/c4/elements', { diagramId, type: 'C4SoftwareSystem', name: 'Web App', technology: 'Node.js', description: 'Main application', x1: 350, y1: 50, x2: 550, y2: 150 });
    sysId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create container');
  let containerId;
  try {
    const res = await apiPost('/api/c4/elements', { diagramId, type: 'C4Container', name: 'Database', technology: 'PostgreSQL', description: 'Stores data', x1: 350, y1: 250, x2: 550, y2: 350 });
    containerId = res.data._id;
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create relationship: User → WebApp');
  try {
    await apiPost('/api/c4/relationships', { diagramId, sourceId: personId, targetId: sysId, description: 'Uses', technology: 'HTTPS' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  s = ctx.step('Create relationship: WebApp → Database');
  try {
    await apiPost('/api/c4/relationships', { diagramId, sourceId: sysId, targetId: containerId, description: 'Reads/Writes', technology: 'SQL' });
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }

  await ctx.layoutDiagram(diagramId);
  await ctx.exportDiagram(diagramId, 'Export C4 image');

  s = ctx.step('Delete diagram');
  try {
    await apiDelete(`/api/c4/diagrams/${encId(diagramId)}`);
    s.pass();
  } catch (e) { s.fail(e.message); throw e; }
});
