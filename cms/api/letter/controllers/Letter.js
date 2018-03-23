'use strict';

/**
 * Letter.js controller
 *
 * @description: A set of functions called "actions" for managing `Letter`.
 */

module.exports = {

  /**
   * Retrieve letter records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.letter.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a letter record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.letter.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an letter record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.letter.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an letter record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.letter.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an letter record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.letter.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  }
};
