import { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types';
import { parseId } from '../utils/request';
import * as unitService from '../services/unit.service';
import type { UnitBody } from '../schemas/unit.schema';

// NOTE: in the UI this entity is presented as "Branch"; the DB table/model
// remains `units` for backward compatibility.

export async function listUnits(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const units = await unitService.listUnits();
    res.json(units);
  } catch (err) {
    next(err);
  }
}

export async function createUnit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  const { name } = req.body as UnitBody;

  try {
    const unit = await unitService.createUnit(name);
    res.status(201).json(unit);
  } catch (err) {
    next(err);
  }
}

export async function updateUnit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req);
    const { name } = req.body as UnitBody;
    const unit = await unitService.updateUnit(id, name);
    res.json(unit);
  } catch (err) {
    next(err);
  }
}

export async function deleteUnit(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req);
    await unitService.deleteUnit(id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
