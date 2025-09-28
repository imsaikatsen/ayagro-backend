const teamRepository = require('../repositories/team.repository');
const ApiError = require('../utils/apiError');

class TeamService {
  async createTeam(data) {
    return await teamRepository.create(data);
  }

  async getAllTeams(page, limit) {
    return await teamRepository.findAll(page, limit);
  }

  async getTeamById(id) {
    const member = await teamRepository.findById(id);
    if (!member) throw new ApiError(404, 'Team member not found');
    return member;
  }

  async updateTeamById(id, data) {
    const updated = await teamRepository.updateById(id, data);
    if (!updated) throw new ApiError(500, 'Failed to update team member');
    return updated;
  }

  async deleteTeamById(id) {
    const deleted = await teamRepository.deleteById(id);
    if (!deleted) throw new ApiError(500, 'Failed to delete team member');
    return;
  }

  async reorderTeams(orderData) {
    return await teamRepository.bulkReorder(orderData);
  }
}

module.exports = new TeamService();
