'use strict';

/**
 * Representative.js controller
 *
 * @description: A set of functions called "actions" for managing `Representative`.
 */

module.exports = {

  /**
   * Retrieve representative records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.representative.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a representative record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.representative.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an representative record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.representative.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an representative record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.representative.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an representative record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.representative.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  }
};
