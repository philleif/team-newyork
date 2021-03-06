'use strict';

/**
 * Notification.js controller
 *
 * @description: A set of functions called "actions" for managing `Notification`.
 */

module.exports = {

  /**
   * Retrieve notification records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.notification.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a notification record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.notification.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an notification record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.notification.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an notification record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.notification.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an notification record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.notification.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  }
};
