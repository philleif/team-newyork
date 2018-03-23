'use strict';

/**
 * Meeting.js controller
 *
 * @description: A set of functions called "actions" for managing `Meeting`.
 */

module.exports = {

  /**
   * Retrieve meeting records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.meeting.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a meeting record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.meeting.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an meeting record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.meeting.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an meeting record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.meeting.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an meeting record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.meeting.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  }
};
