'use strict';

/**
 * Event.js controller
 *
 * @description: A set of functions called "actions" for managing `Event`.
 */

module.exports = {

  /**
   * Retrieve event records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.event.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a event record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.event.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an event record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.event.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an event record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.event.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an event record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.event.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  }
};
