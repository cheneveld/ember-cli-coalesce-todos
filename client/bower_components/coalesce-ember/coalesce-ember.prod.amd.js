/*!
 * @overview  Coalesce-Ember
 * @copyright Copyright 2014 Gordon L. Hempton and contributors
 * @license   Licensed under MIT license
 *            See https://raw.github.com/coalescejs/coalesce-ember/master/LICENSE
 * @version   0.4.0+dev.6cfcc61a
 */
define("coalesce-ember", ['./namespace', 'coalesce', './initializers', './model/model', './model/model', './collections/has_many_array'], function($__0,$__2,$__4,$__5,$__7,$__9) {
  "use strict";
  var __moduleName = "coalesce-ember";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__5 || !$__5.__esModule)
    $__5 = {default: $__5};
  if (!$__7 || !$__7.__esModule)
    $__7 = {default: $__7};
  if (!$__9 || !$__9.__esModule)
    $__9 = {default: $__9};
  var Cs = $__0.default;
  var Coalesce = $__2.default;
  $__4;
  var Model = $__5.default;
  var $__8 = $__7,
      attr = $__8.attr,
      hasMany = $__8.hasMany,
      belongsTo = $__8.belongsTo;
  var HasManyArray = $__9.default;
  Cs.Model = Model;
  Cs.attr = attr;
  Cs.hasMany = hasMany;
  Cs.belongsTo = belongsTo;
  Coalesce.Promise = Ember.RSVP.Promise;
  Coalesce.ajax = Ember.$.ajax;
  Coalesce.run = Ember.run;
  _.defaults(Cs, Coalesce);
  var $__default = Cs;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define("coalesce-ember/collections/has_many_array", ['./model_array'], function($__0) {
  "use strict";
  var __moduleName = "coalesce-ember/collections/has_many_array";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var ModelArray = $__0.default;
  var get = Ember.get,
      set = Ember.set;
  var $__default = ModelArray.extend({
    name: null,
    owner: null,
    session: Ember.computed(function() {
      return get(this, 'owner.session');
    }).volatile(),
    replace: function(idx, amt, objects) {
      var session = get(this, 'session');
      if (session) {
        objects = objects.map(function(model) {
          return session.add(model);
        }, this);
      }
      return this._super(idx, amt, objects);
    },
    objectAtContent: function(index) {
      var content = get(this, 'content'),
          model = content.objectAt(index),
          session = get(this, 'session');
      if (session && model) {
        return session.add(model);
      }
      return model;
    },
    arrayContentWillChange: function(index, removed, added) {
      var model = get(this, 'owner'),
          name = get(this, 'name'),
          session = get(this, 'session');
      if (session) {
        session.modelWillBecomeDirty(model);
        if (!model._suspendedRelationships) {
          for (var i = index; i < index + removed; i++) {
            var inverseModel = this.objectAt(i);
            session.inverseManager.unregisterRelationship(model, name, inverseModel);
          }
        }
      }
      return this._super.apply(this, arguments);
    },
    arrayContentDidChange: function(index, removed, added) {
      this._super.apply(this, arguments);
      var model = get(this, 'owner'),
          name = get(this, 'name'),
          session = get(this, 'session');
      if (session && !model._suspendedRelationships) {
        for (var i = index; i < index + added; i++) {
          var inverseModel = this.objectAt(i);
          session.inverseManager.registerRelationship(model, name, inverseModel);
        }
      }
    }
  });
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define("coalesce-ember/collections/model_array", ['coalesce', 'coalesce/collections/model_set', 'coalesce/utils/is_equal'], function($__0,$__2,$__4) {
  "use strict";
  var __moduleName = "coalesce-ember/collections/model_array";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  var Coalesce = $__0.default;
  var ModelSet = $__2.default;
  var isEqual = $__4.default;
  var get = Ember.get,
      set = Ember.set;
  var $__default = Ember.ArrayProxy.extend({
    session: null,
    meta: null,
    init: function() {
      if (!get(this, 'content')) {
        set(this, 'content', []);
      }
      this._super.apply(this, arguments);
    },
    arrayContentWillChange: function(index, removed, added) {
      for (var i = index; i < index + removed; i++) {
        var model = this.objectAt(i);
        var session = get(this, 'session');
        if (session) {
          session.collectionManager.unregister(this, model);
        }
      }
      this._super.apply(this, arguments);
    },
    arrayContentDidChange: function(index, removed, added) {
      this._super.apply(this, arguments);
      for (var i = index; i < index + added; i++) {
        var model = this.objectAt(i);
        var session = get(this, 'session');
        if (session) {
          session.collectionManager.register(this, model);
        }
      }
    },
    removeObject: function(obj) {
      var loc = get(this, 'length') || 0;
      while (--loc >= 0) {
        var curObject = this.objectAt(loc);
        if (curObject.isEqual(obj))
          this.removeAt(loc);
      }
      return this;
    },
    contains: function(obj) {
      for (var i = 0; i < get(this, 'length'); i++) {
        var m = this.objectAt(i);
        if (obj.isEqual(m))
          return true;
      }
      return false;
    },
    copy: function() {
      return this.content.copy();
    },
    copyTo: function(dest) {
      var existing = ModelSet.create();
      existing.addObjects(dest);
      this.forEach(function(model) {
        if (existing.contains(model)) {
          existing.remove(model);
        } else {
          dest.pushObject(model);
        }
      });
      dest.removeObjects(existing);
    },
    diff: function(arr) {
      var diff = Ember.A();
      this.forEach(function(model) {
        if (!arr.contains(model)) {
          diff.push(model);
        }
      }, this);
      arr.forEach(function(model) {
        if (!this.contains(model)) {
          diff.push(model);
        }
      }, this);
      return diff;
    },
    isEqual: function(arr) {
      return this.diff(arr).length === 0;
    },
    load: function() {
      var array = this;
      return Ember.RSVP.all(this.map(function(model) {
        return model.load();
      })).then(function() {
        return array;
      });
    }
  });
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define("coalesce-ember/container", ['coalesce/container', './debug/debug_adapter', './session', './model/errors'], function($__0,$__2,$__4,$__6) {
  "use strict";
  var __moduleName = "coalesce-ember/container";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {default: $__6};
  var setupContainer = $__0.setupContainer;
  var DebugAdapter = $__2.default;
  var Session = $__4.default;
  var Errors = $__6.default;
  function setupContainerForEmber(container) {
    setupContainer.apply(this, arguments);
    container.register('model:errors', Errors);
    container.register('session:base', Session);
    container.register('session:main', container.lookupFactory('session:application') || Session);
    container.typeInjection('controller', 'adapter', 'adapter:main');
    container.typeInjection('controller', 'session', 'session:main');
    container.typeInjection('route', 'adapter', 'adapter:main');
    container.typeInjection('route', 'session', 'session:main');
    if (Ember.DataAdapter) {
      container.typeInjection('data-adapter', 'session', 'session:main');
      container.register('data-adapter:main', DebugAdapter);
    }
  }
  ;
  return {
    get setupContainer() {
      return setupContainerForEmber;
    },
    __esModule: true
  };
});

define("coalesce-ember/debug/debug_adapter", ['../model/model', '../promise', './debug_info'], function($__0,$__2,$__4) {
  "use strict";
  var __moduleName = "coalesce-ember/debug/debug_adapter";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  var get = Ember.get,
      capitalize = Ember.String.capitalize,
      underscore = Ember.String.underscore;
  var Model = $__0.default;
  var PromiseArray = $__2.PromiseArray;
  $__4;
  var $__default = Ember.DataAdapter.extend({
    getFilters: function() {
      return [{
        name: 'isNew',
        desc: 'New'
      }, {
        name: 'isModified',
        desc: 'Modified'
      }, {
        name: 'isClean',
        desc: 'Clean'
      }];
    },
    detect: function(klass) {
      return klass !== Model && Model.detect(klass);
    },
    columnsForType: function(type) {
      var columns = [{
        name: 'id',
        desc: 'Id'
      }, {
        name: 'clientId',
        desc: 'Client Id'
      }, {
        name: 'rev',
        desc: 'Revision'
      }, {
        name: 'clientRev',
        desc: 'Client Revision'
      }],
          count = 0,
          self = this;
      Ember.A(get(type, 'attributes')).forEach(function(name, meta) {
        if (count++ > self.attributeLimit) {
          return false;
        }
        var desc = capitalize(underscore(name).replace('_', ' '));
        columns.push({
          name: name,
          desc: desc
        });
      });
      return columns;
    },
    getRecords: function(type) {
      return PromiseArray.create({promise: this.get('session').query(type)});
    },
    getRecordColumnValues: function(record) {
      var self = this,
          count = 0,
          columnValues = {id: get(record, 'id')};
      record.eachAttribute(function(key) {
        if (count++ > self.attributeLimit) {
          return false;
        }
        var value = get(record, key);
        columnValues[key] = value;
      });
      return columnValues;
    },
    getRecordKeywords: function(record) {
      var keywords = [],
          keys = Ember.A(['id']);
      record.eachAttribute(function(key) {
        keys.push(key);
      });
      keys.forEach(function(key) {
        keywords.push(get(record, key));
      });
      return keywords;
    },
    getRecordFilterValues: function(record) {
      return {
        isNew: record.get('isNew'),
        isModified: record.get('isDirty') && !record.get('isNew'),
        isClean: !record.get('isDirty')
      };
    },
    getRecordColor: function(record) {
      var color = 'black';
      if (record.get('isNew')) {
        color = 'green';
      } else if (record.get('isDirty')) {
        color = 'blue';
      }
      return color;
    },
    observeRecord: function(record, recordUpdated) {
      var releaseMethods = Ember.A(),
          self = this,
          keysToObserve = Ember.A(['id', 'clientId', 'rev', 'clientRev', 'isNew', 'isDirty', 'isDeleted']);
      record.eachAttribute(function(key) {
        keysToObserve.push(key);
      });
      keysToObserve.forEach(function(key) {
        var handler = function() {
          recordUpdated(self.wrapRecord(record));
        };
        Ember.addObserver(record, key, handler);
        releaseMethods.push(function() {
          Ember.removeObserver(record, key, handler);
        });
      });
      var release = function() {
        releaseMethods.forEach(function(fn) {
          fn();
        });
      };
      return release;
    }
  });
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define("coalesce-ember/debug/debug_info", ['../model/model'], function($__0) {
  "use strict";
  var __moduleName = "coalesce-ember/debug/debug_info";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var Model = $__0.default;
  Model.reopen({_debugInfo: function() {
      var attributes = ['id'],
          relationships = {
            belongsTo: [],
            hasMany: []
          },
          expensiveProperties = [];
      this.eachAttribute(function(name, meta) {
        attributes.push(name);
      }, this);
      this.eachRelationship(function(name, relationship) {
        relationships[relationship.kind].push(name);
        expensiveProperties.push(name);
      });
      var groups = [{
        name: 'Attributes',
        properties: attributes,
        expand: true
      }, {
        name: 'Belongs To',
        properties: relationships.belongsTo,
        expand: true
      }, {
        name: 'Has Many',
        properties: relationships.hasMany,
        expand: true
      }, {
        name: 'Flags',
        properties: ['isDirty', 'isDeleted', 'hasErrors']
      }];
      return {propertyInfo: {
          includeOtherProperties: true,
          groups: groups,
          expensiveProperties: expensiveProperties
        }};
    }});
  return {};
});

define("coalesce-ember/initializers", ['coalesce', './container'], function($__0,$__2) {
  "use strict";
  var __moduleName = "coalesce-ember/initializers";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var Coalesce = $__0.default;
  var setupContainer = $__2.setupContainer;
  Ember.onLoad('Ember.Application', function(Application) {
    Application.initializer({
      name: "coalesce.container",
      initialize: function(container, application) {
        Coalesce.__container__ = container;
        setupContainer(container, application);
      }
    });
  });
  return {};
});

define("coalesce-ember/model/errors", ['coalesce/utils/copy'], function($__0) {
  "use strict";
  var __moduleName = "coalesce-ember/model/errors";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  var copy = $__0.default;
  var get = Ember.get,
      set = Ember.set;
  var Errors = Ember.ObjectProxy.extend(Ember.Copyable, {
    init: function() {
      this._super.apply(this, arguments);
      if (!get(this, 'content'))
        set(this, 'content', {});
    },
    forEach: function(callback, self) {
      var keys = Ember.keys(this.content);
      keys.forEach(function(key) {
        var value = get(this.content, key);
        callback.call(self, key, value);
      }, this);
    },
    copy: function() {
      return Errors.create({content: copy(this.content)});
    }
  });
  var $__default = Errors;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define("coalesce-ember/model/model", ['../utils/apply_ember', 'coalesce/model/model', 'coalesce/model/field', 'coalesce/model/attribute', 'coalesce/model/has_many', 'coalesce/model/belongs_to', '../collections/has_many_array'], function($__0,$__2,$__4,$__6,$__8,$__10,$__12) {
  "use strict";
  var __moduleName = "coalesce-ember/model/model";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  if (!$__4 || !$__4.__esModule)
    $__4 = {default: $__4};
  if (!$__6 || !$__6.__esModule)
    $__6 = {default: $__6};
  if (!$__8 || !$__8.__esModule)
    $__8 = {default: $__8};
  if (!$__10 || !$__10.__esModule)
    $__10 = {default: $__10};
  if (!$__12 || !$__12.__esModule)
    $__12 = {default: $__12};
  var applyEmber = $__0.default;
  var Model = $__2.default;
  var Field = $__4.default;
  var CoreAttribute = $__6.default;
  var CoreHasMany = $__8.default;
  var CoreBelongsTo = $__10.default;
  var HasManyArray = $__12.default;
  var CoreObject = Ember.CoreObject;
  var Observable = Ember.Observable;
  var Mixin = Ember.Mixin;
  var merge = _.merge,
      defaults = _.defaults;
  var EmberModel = applyEmber(Model, ['fields', 'ownFields', 'attributes', 'relationships'], Observable, {
    metaWillChange: function(name) {
      Model.prototype.metaWillChange.apply(this, arguments);
      Ember.propertyWillChange(this, name);
      if (name === 'id') {
        Ember.propertyWillChange(this, 'isNew');
      }
    },
    metaDidChange: function(name) {
      Model.prototype.metaDidChange.apply(this, arguments);
      Ember.propertyDidChange(this, name);
      if (name === 'id') {
        Ember.propertyDidChange(this, 'isNew');
      }
    },
    attributeWillChange: function(name) {
      Model.prototype.attributeWillChange.apply(this, arguments);
      Ember.propertyWillChange(this, name);
    },
    attributeDidChange: function(name) {
      Model.prototype.attributeDidChange.apply(this, arguments);
      Ember.propertyDidChange(this, name);
    },
    belongsToWillChange: function(name) {
      Model.prototype.belongsToWillChange.apply(this, arguments);
      Ember.propertyWillChange(this, name);
    },
    belongsToDidChange: function(name) {
      Model.prototype.belongsToDidChange.apply(this, arguments);
      Ember.propertyDidChange(this, name);
    },
    hasManyWillChange: function(name) {
      Model.prototype.hasManyWillChange.apply(this, arguments);
      Ember.propertyWillChange(this, name);
    },
    hasManyDidChange: function(name) {
      Model.prototype.hasManyDidChange.apply(this, arguments);
      Ember.propertyDidChange(this, name);
    },
    didDefineProperty: function(obj, keyName, value) {
      if (value instanceof Attr) {
        obj.constructor.defineField(new CoreAttribute(keyName, value));
      } else if (value instanceof BelongsTo) {
        obj.constructor.defineField(new CoreBelongsTo(keyName, value));
      } else if (value instanceof HasMany) {
        obj.constructor.defineField(new CoreHasMany(keyName, value));
      }
    }
  });
  function Attr(type) {
    var options = arguments[1] !== (void 0) ? arguments[1] : {};
    defaults(options, {type: type});
    merge(this, options);
    return this;
  }
  function attr(type) {
    var options = arguments[1] !== (void 0) ? arguments[1] : {};
    return new Attr(type, options);
  }
  function HasMany(type) {
    var options = arguments[1] !== (void 0) ? arguments[1] : {};
    defaults(options, {
      kind: 'hasMany',
      collectionType: HasManyArray,
      type: type
    });
    merge(this, options);
    return this;
  }
  function hasMany(type) {
    var options = arguments[1] !== (void 0) ? arguments[1] : {};
    return new HasMany(type, options);
  }
  function BelongsTo(type) {
    var options = arguments[1] !== (void 0) ? arguments[1] : {};
    defaults(options, {
      kind: 'belongsTo',
      type: type
    });
    merge(this, options);
    return this;
  }
  function belongsTo(type) {
    var options = arguments[1] !== (void 0) ? arguments[1] : {};
    return new BelongsTo(type, options);
  }
  var META_KEYS = ['id', 'clientId', 'rev', 'clientRev', 'errors', 'isDeleted'];
  EmberModel.reopenClass({
    create: function(hash) {
      var fields = {};
      for (var key in hash) {
        if (!hash.hasOwnProperty(key))
          continue;
        if (this.fields.get(key) || META_KEYS.indexOf(key) !== -1) {
          fields[key] = hash[key];
          delete hash[key];
        }
      }
      var res = this._super.apply(this, arguments);
      for (var key in fields) {
        if (!fields.hasOwnProperty(key))
          continue;
        res[key] = fields[key];
      }
      return res;
    },
    extend: function() {
      var klass = this._super.apply(this, arguments);
      klass.proto();
      return klass;
    }
  });
  ;
  var $__default = EmberModel;
  return {
    get attr() {
      return attr;
    },
    get hasMany() {
      return hasMany;
    },
    get belongsTo() {
      return belongsTo;
    },
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define("coalesce-ember/namespace", [], function() {
  "use strict";
  var __moduleName = "coalesce-ember/namespace";
  var Cs;
  if ('undefined' === typeof Cs) {
    Cs = Ember.Namespace.create({VERSION: '0.4.0+dev.6cfcc61a'});
  }
  var $__default = Cs;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define("coalesce-ember/promise", [], function() {
  "use strict";
  var __moduleName = "coalesce-ember/promise";
  var ModelPromise = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin, {load: passThroughMethod('load')});
  function passThroughMethod(name, defaultReturn) {
    return function() {
      var content = get(this, 'content');
      if (!content)
        return defaultReturn;
      return content[name].apply(content, arguments);
    };
  }
  var PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);
  ;
  return {
    get ModelPromise() {
      return ModelPromise;
    },
    get PromiseArray() {
      return PromiseArray;
    },
    __esModule: true
  };
});

define("coalesce-ember/session", ['coalesce/session/session', './promise'], function($__0,$__2) {
  "use strict";
  var __moduleName = "coalesce-ember/session";
  if (!$__0 || !$__0.__esModule)
    $__0 = {default: $__0};
  if (!$__2 || !$__2.__esModule)
    $__2 = {default: $__2};
  var Session = $__0.default;
  var $__3 = $__2,
      ModelPromise = $__3.ModelPromise,
      PromiseArray = $__3.PromiseArray;
  var EmberSession = function EmberSession() {
    $traceurRuntime.defaultSuperCall(this, $EmberSession.prototype, arguments);
  };
  var $EmberSession = EmberSession;
  ($traceurRuntime.createClass)(EmberSession, {
    loadModel: function(model, opts) {
      return ModelPromise.create({
        content: model,
        promise: $traceurRuntime.superCall(this, $EmberSession.prototype, "loadModel", [model, opts])
      });
    },
    query: function(type, query, opts) {
      return PromiseArray.create({promise: $traceurRuntime.superCall(this, $EmberSession.prototype, "query", [type, query, opts])});
    }
  }, {}, Session);
  var $__default = EmberSession;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});

define("coalesce-ember/utils/apply_ember", [], function() {
  "use strict";
  var __moduleName = "coalesce-ember/utils/apply_ember";
  var CoreObject = Ember.CoreObject,
      Mixin = Ember.Mixin;
  function applyEmber(Type) {
    var specialClassKeys = arguments[1] !== (void 0) ? arguments[1] : [];
    for (var mixins = [],
        $__0 = 2; $__0 < arguments.length; $__0++)
      mixins[$__0 - 2] = arguments[$__0];
    function cstor() {
      return CoreObject.apply(this);
    }
    var PrototypeMixin = Mixin.create(CoreObject.PrototypeMixin);
    PrototypeMixin.ownerConstructor = cstor;
    cstor.PrototypeMixin = PrototypeMixin;
    cstor.prototype = Object.create(Type.prototype);
    var SpecialClassProps = {};
    for (var key in Type) {
      if (!Type.hasOwnProperty(key))
        continue;
      if (specialClassKeys.indexOf(key) !== -1)
        continue;
      SpecialClassProps[key] = Type[key];
    }
    var ClassMixin = Mixin.create(SpecialClassProps, CoreObject.ClassMixin);
    ClassMixin.reopen({extend: function() {
        var klass = this._super.apply(this, arguments);
        specialClassKeys.forEach(function(name) {
          var desc = Object.getOwnPropertyDescriptor(Type, name);
          Object.defineProperty(klass, name, desc);
        });
        Object.defineProperty(klass, 'parentType', {get: function() {
            return this.superclass;
          }});
        return klass;
      }});
    ClassMixin.apply(cstor);
    ClassMixin.ownerConstructor = cstor;
    cstor.ClassMixin = ClassMixin;
    cstor.proto = function() {
      return this.prototype;
    };
    mixins.unshift({init: function() {
        Type.apply(this, arguments);
        this._super.apply(this, arguments);
      }});
    return cstor.extend.apply(cstor, mixins);
  }
  var $__default = applyEmber;
  return {
    get default() {
      return $__default;
    },
    __esModule: true
  };
});
