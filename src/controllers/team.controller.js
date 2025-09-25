const teamService = require('../services/team.service');

class TeamController {
  async create(req, res, next) {
    try {
      console.log(req.file);
      const teamData = req.body;
      if (req.file) teamData.image = req.file.filename;
      const member = await teamService.createTeam(teamData);
      res.status(201).json({ message: 'Team member created', data: member });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const members = await teamService.getAllTeams(page, limit);
      res.status(200).json({ message: 'Team members fetched', data: members });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const member = await teamService.getTeamById(req.params.id);
      res.status(200).json({ message: 'Team member fetched', data: member });
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updateData = req.body;
      if (req.file) updateData.image = req.file.filename;
      const updated = await teamService.updateTeamById(
        req.params.id,
        updateData
      );
      res.status(200).json({ message: 'Team member updated', data: updated });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await teamService.deleteTeamById(req.params.id);
      res.status(200).json({ message: 'Team member deleted' });
    } catch (err) {
      next(err);
    }
  }

  async reorder(req, res, next) {
    try {
      const reordered = await teamService.reorderTeams(req.body);
      res
        .status(200)
        .json({ message: 'Team members reordered', data: reordered });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TeamController();
