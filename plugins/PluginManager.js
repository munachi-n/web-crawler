class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
  }

  register(plugin) {
    if (!plugin.name) throw new Error('Plugin must have a name');

    this.plugins.set(plugin.name, {
      name: plugin.name,
      version: plugin.version || '1.0.0',
      instance: plugin,
      enabled: true,
    });

    if (typeof plugin.init === 'function') {
      plugin.init(this);
    }

    return this;
  }

  unregister(name) {
    const entry = this.plugins.get(name);
    if (entry && typeof entry.instance.destroy === 'function') {
      entry.instance.destroy();
    }
    this.plugins.delete(name);
  }

  addHook(hookName, pluginName, handler) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, []);
    }
    this.hooks.get(hookName).push({ pluginName, handler });
  }

  async executeHook(hookName, context) {
    const handlers = this.hooks.get(hookName) || [];
    let result = context;

    for (const { handler, pluginName } of handlers) {
      const entry = this.plugins.get(pluginName);
      if (entry && entry.enabled) {
        try {
          result = await handler(result);
        } catch (error) {
          console.error(`Plugin [${pluginName}] hook [${hookName}] error:`, error.message);
        }
      }
    }

    return result;
  }

  enable(name) {
    const entry = this.plugins.get(name);
    if (entry) entry.enabled = true;
  }

  disable(name) {
    const entry = this.plugins.get(name);
    if (entry) entry.enabled = false;
  }

  list() {
    return Array.from(this.plugins.values()).map(({ name, version, enabled }) => ({ name, version, enabled }));
  }
}

module.exports = PluginManager;
