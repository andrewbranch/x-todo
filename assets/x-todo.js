define("x-todo/adapters/application", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];
    var staticEnvironment = window.XTodo.environment === "static";

    __exports__["default"] = staticEnvironment ? DS.FixtureAdapter : DS.RESTAdapter.extend({

      namespace: "api",
      host: "http://localhost:50993"

    });
  });
define("x-todo/app", 
  ["ember","ember/resolver","ember/load-initializers","x-todo/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Resolver = __dependency2__["default"];
    var loadInitializers = __dependency3__["default"];
    var config = __dependency4__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix,
      Resolver: Resolver
    });

    loadInitializers(App, config.modulePrefix);

    __exports__["default"] = App;
  });
define("x-todo/components/click-to-edit-text", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var RETURN = 13,
        ESCAPE = 27;

    __exports__["default"] = Ember.Component.extend({

      classNames: ["click-to-edit-text"],
      attributeBindings: ["style"],

      didInsertElement: function () {
        var self = this;

        this.$("input").on("blur", function () {
          self.sendAction("blur");
          self.set("editing", false);
        }).on("keyup", function (event) {
          if (event.which === RETURN) {
            self.sendAction("return");
            self.set("editing", false);
            return;
          }

          if (event.which === ESCAPE) {
            self.set("editing", false);
          }
        });
      },

      click: function () {
        if (!this.get("editing")) {
          this.set("editing", true);
        }
      },

      focusInput: (function () {
        if (this.get("editing")) {
          Ember.run.scheduleOnce("afterRender", this, function () {
            this.$("input").focus();
          });
        }
      }).observes("editing").on("didInsertElement")

    });
  });
define("x-todo/components/color-picker", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global tinycolor */

    var Ember = __dependency1__["default"];

    var colors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) {
      var color = tinycolor("#b76868").spin(-30 * i).toString();
      return {
        color: color,
        colorStyle: "color: " + color + ";",
        backgroundColorStyle: "background-color: " + color + ";"
      };
    });

    __exports__["default"] = Ember.Component.extend({

      classNames: ["color-picker"],

      didInsertElement: function () {
        this.$(".ui.dropdown").dropdown();
        if (!this.get("selectedColor")) {
          this.assignDefaultColor();
        }
      },

      assignDefaultColor: function () {
        var options = colors.filter((function (c) {
          return !(this.get("defaultColorExcludes") || []).contains(c.color);
        }).bind(this));
        if (!options.length) {
          options = colors;
        }
        this.set("selectedColor", options[Math.floor(Math.random() * (options.length - 1))].color);
      },

      colorData: (function () {
        return colors.map((function (c) {
          return {
            selected: c.color === this.get("selectedColor"),
            data: c
          };
        }).bind(this));
      }).property("selectedColor"),

      selectedColorData: (function () {
        return colors.find((function (c) {
          return c.color === this.get("selectedColor");
        }).bind(this));
      }).property("selectedColor"),

      updateController: (function () {
        this.sendAction("updatedColorData", this.get("selectedColorData"));
      }).observes("selectedColorData").on("init"),

      actions: {
        pickColor: function (color) {
          this.set("selectedColor", color.color);
        }
      }

    });
  });
define("x-todo/components/date-field", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global Pikaday, moment */

    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.TextField.extend({
      picker: null,

      updateValue: (function () {
        var date = this.get("date"),
            picker = this.get("picker");
        if (picker && date.isValid() && !this.$().is(":focus")) {
          this.set("value", date.format("L"));
          picker.setDate(date.format("L"));
        }
      }).observes("date"),

      updateDate: (function () {
        var previousDate = this.get("date"),
            date = moment(new Date(this.get("value"))).hour(previousDate.hour()).minute(previousDate.minute());
        if (date.isValid()) {
          this.set("date", date);
        } else {
          this.set("date", null);
        }
      }).observes("value"),

      didInsertElement: function () {
        var picker = new Pikaday({
          field: this.$()[0],
          format: "MM/DD/YYYY"
        });
        this.set("picker", picker);
        this.updateValue();
        picker.show();
      },

      willDestroyElement: function () {
        var picker = this.get("picker");
        if (picker) {
          picker.destroy();
        }
        this.set("picker", null);
      }
    });
  });
define("x-todo/components/date-time-field", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var doneTimer,
        RETURN = 13,
        ESCAPE = 27;

    __exports__["default"] = Ember.Component.extend({

      classNames: ["date-time-field", "ui", "input"],

      isMobile: (function () {
        var check = false;
        (function (a) {
          if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            check = true;
          }
        })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
      }).property(),

      hour: (function () {
        return this.get("date").hour();
      }).property("date"),

      minute: (function () {
        return this.get("date").format("mm");
      }).property("date"),

      meridiem: (function () {
        return this.get("date").format("A");
      }).property("date"),

      formattedHour: (function () {
        return this.get("date").format("h");
      }).property("date"),

      updateTime: (function () {
        var h = this.get("formattedHour") % 12 + (this.get("meridiem") === "AM" ? 0 : 12);
        this.set("date", this.get("date").hour(h).minute(this.get("minute")));
      }).observes("formattedHour", "minute", "meridiem"),

      focusOut: function () {
        doneTimer = Ember.run.later(this, function () {
          this.sendAction("done");
        }, 100);
      },

      focusIn: function () {
        Ember.run.cancel(doneTimer);
      },

      keyDown: function (event) {
        if ([RETURN, ESCAPE].contains(event.which)) {
          this.sendAction("done");
        }
      },

      actions: {
        advance: function () {
          var inputs = this.$("input");
          inputs.eq(inputs.index(inputs.filter(":focus")) + 1).focus();
        }
      }

    });
  });
define("x-todo/components/native-date", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global moment */

    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.TextField.extend({

      didInsertElement: function () {
        this.$().focus();
      },

      textToDateTransform: (function (key, value) {
        var date;
        if (arguments.length === 2) {
          if (value && /\d{4}-\d{2}-\d{2}/.test(value)) {
            var parts = value.split("-");
            date = new Date();
            date.setYear(parts[0]);
            date.setMonth(parts[1] - 1);
            date.setDate(parts[2]);

            this.set("date", moment(date));
          } else {
            this.set("date", null);
          }
        } else if (!value && this.get("date")) {
          return this.get("date").format("YYYY-MM-DD");
        } else {
          return value;
        }
      }).property(),

      placeholder: "yyyy-mm-dd",
      valueBinding: "textToDateTransform"
    });
  });
define("x-todo/components/replacing-field", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var reselectTimer,
        LEFT_ARROW = 37,
        RIGHT_ARROW = 39,
        RETURN = 13,
        ESCAPE = 27,
        SPACE = 32;

    __exports__["default"] = Ember.TextField.extend({

      classNames: ["replacing-field"],
      interval: 1000,
      validationPattern: ".*",


      willReplace: function () {
        return Math.abs(this.element.selectionEnd - this.element.selectionStart) === this.get("value.length");
      },

      selectText: (function () {
        // There's a chance the element has already been removed
        if (this.element) {
          this.element.setSelectionRange(0, this.element.value.length);
        }
      }).on("focusIn", "click"),

      cancelReselection: (function () {
        Ember.run.cancel(reselectTimer);
      }).on("focusOut"),

      keyDown: function (event) {
        if (event.which === LEFT_ARROW || event.which === RIGHT_ARROW) {
          return false;
        }
        if (event.which === RETURN || event.which === ESCAPE || event.which <= 46 && event.which !== SPACE) {
          return true;
        }

        var key = String.fromCharCode(event.which),
            optionsString = this.get("autocompleteOptions"),
            options = optionsString ? optionsString.split(",") : [],
            advanceCharactersString = this.get("advanceCharacters"),
            advanceCharacters = advanceCharactersString ? advanceCharactersString.split(",") : [],
            advanceShiftCharacters = advanceCharacters.map(function (c) {
          return !! ~c.indexOf("SHIFT") ? c.replace("SHIFT", "") : undefined;
        });

        if (advanceCharacters.contains(key) || event.shiftKey && advanceShiftCharacters.contains(key)) {
          this.sendAction("advance");
          return false;
        }

        if (options.length && this.willReplace()) {
          var option = options.find(function (o) {
            return o.toLowerCase().indexOf(key.toLowerCase()) === 0;
          });
          if (option) {
            this.set("value", option);
            Ember.run.scheduleOnce("afterRender", this, "selectText");
          }
          return false;
        }


        if (new RegExp(this.get("validationPattern")).test(this.willReplace() ? key : this.get("value") + key)) {
          return true;
        }

        return false;
      },

      reselect: (function () {
        if (this.$().is(":focus")) {
          reselectTimer = Ember.run.debounce(this, "selectText", this.get("interval"));
        }
      }).observes("value")

    });
  });
define("x-todo/controllers/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({

      countTime: (function () {
        this.set("currentTime", new Date());
        Ember.run.later(this, "countTime", 1000);
      }).on("init")

    });
  });
define("x-todo/controllers/categories", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend(Ember.SortableMixin, {

      sortProperties: ["index"],

      anyCompleted: (function () {
        return this.get("completedTasks.length");
      }).property("completedTasks.length"),

      completedTasks: (function () {
        return [].concat.apply([], this.get("model").map(function (c) {
          return c.get("tasks").filter(function (t) {
            return t.get("completed");
          });
        }));
      }).property(),

      usedColors: (function () {
        return this.get("model").map(function (c) {
          return c.get("color");
        });
      }).property("@each.color"),

      updateIndexes: (function () {
        var categories = this.get("arrangedContent");
        this.beginPropertyChanges();
        for (var i = 0; i < categories.length; i++) {
          if (categories[i].get("index") !== i) {
            categories[i].set("index", i);
            categories[i].save();
          }
        }
        this.endPropertyChanges();
      }).observes("[]"),

      actions: {

        addCategory: function () {
          // Create on client side, persist after user names it
          this.store.createRecord("category", {
            index: this.get("length") // Add to the end
          });
        },

        removeCompletedTasks: function () {
          this.get("completedTasks").forEach(function (t) {
            if (! ~t.get("currentState.stateName").indexOf("inFlight")) {
              t.destroyRecord();
            }
          });
        }
      }

    });
  });
define("x-todo/controllers/category", 
  ["ember","x-todo/controllers/editable-object","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var EditableObjectController = __dependency2__["default"];
    var previousName;

    __exports__["default"] = EditableObjectController.extend({

      needs: ["categories"],

      isValid: (function () {
        return (this.get("name") || "").trim().length > 0;
      }).property("name"),

      sortedTasks: (function () {
        return Ember.ArrayProxy.createWithMixins(Ember.SortableMixin, {
          sortProperties: ["index"],
          content: this.get("tasks")
        });
      }).property("tasks"),

      notifyCompletedTasks: (function () {
        this.get("controllers.categories").notifyPropertyChange("completedTasks");
      }).observes("tasks.@each.completed"),

      setPreviousName: (function () {
        if (this.get("editing")) {
          previousName = this.get("name");
        }
      }).observes("editing"),

      undoDeletingNameOrDeleteEmpty: (function () {
        if (!this.get("editing") && !this.get("name.length")) {
          if (this.get("tasks.length")) {
            this.set("name", previousName);
          } else {
            this.send("delete");
          }
        }
      }).observes("editing"),

      actions: {

        addTask: function () {
          this.store.createRecord("task", {
            index: this.get("tasks").get("length"),
            category: this.get("model")
          });
        },

        saveAutomatically: (function () {
          this._super();
        }).observes("name", "color"),

        "delete": function () {
          if (!this.get("tasks").get("length") || confirm("All tasks in this category will be deleted.")) {
            this.get("model").destroyRecord();
          }
        },

        updateColor: function (colorData) {
          this.set("colorData", colorData);
        },

        updateTaskIndexes: function (indexHash) {
          var updateTask = function (task) {
            if (task.get("index") !== indexHash[this]) {
              task.set("index", indexHash[this]);
              task.save();
            }
          };

          this.beginPropertyChanges();
          for (var taskId in indexHash) {
            this.store.find("task", parseInt(taskId)).then(updateTask.bind(taskId));
          }
          this.endPropertyChanges();
        },

        updateTaskCategory: function (taskId) {
          this.store.find("task", taskId).then((function (t) {
            t.set("category", this.get("model"));
            t.save();
          }).bind(this));
        }
      }

    });
  });
define("x-todo/controllers/editable-object", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({

      editing: false,
      saving: false,

      // Go straight to editing mode for new records
      init: function () {
        if (this.get("currentState.stateName") === "root.loaded.created.uncommitted") {
          this.set("editing", true);
        }
      },

      save: function () {
        if (!this.get("saving") && this.get("isDirty") && this.get("isValid")) {
          var self = this;
          this.set("saving", true);
          this.get("model").save().then(function () {
            self.set("saving", false);
          });
        }
      },

      // Automatically save changes after inactivity of 1 second
      saveAutomatically: (function () {
        if (this.get("isDirty") && this.get("isValid")) {
          Ember.run.debounce(this, "save", 1000);
        }
      }).observes("isDirty", "isValid").on("init")

    });
  });
define("x-todo/controllers/task", 
  ["x-todo/controllers/editable-object","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global moment */

    var EditableObjectController = __dependency1__["default"];
    var staticEnvironment = window.XTodo.environment === "static";

    __exports__["default"] = EditableObjectController.extend({

      needs: ["application"],

      dueDate: staticEnvironment ? (function () {
        var dueDate = this.get("model.dueDate");
        if (dueDate) {
          return moment(dueDate);
        }
        return null;
      }).property("model.dueDate") : undefined,

      overdue: (function () {
        return !this.get("completed") && (this.get("dueDate") || Infinity) < this.get("controllers.application.currentTime");
      }).property("dueDate", "completed", "controllers.application.currentTime"),

      timeOverdue: (function () {
        var dueDate = this.get("dueDate");
        if (dueDate) {
          return dueDate.fromNow().replace(" ago", "");
        }
      }).property("dueDate", "controllers.application.currentTime"),

      isValid: (function () {
        return (this.get("title") || "").trim().length > 0;
      }).property("title"),

      saveAutomatically: (function () {
        this._super();
      }).observes("title", "completed"),

      formattedDueDate: (function () {
        var dueDate = this.get("dueDate");
        if (dueDate) {
          return dueDate.calendar();
        }
        return null;
      }).property("dueDate"),

      deleteEmptyTasks: (function () {
        var title = this.get("title");
        if (!this.get("editing") && (!title || !title.length)) {
          this.send("delete");
        }
      }).observes("editing"),

      actions: {
        addDueDate: function () {
          this.set("dueDate", moment().minute(0).add(1, "days"));
          this.set("editingDueDate", true);
        },

        removeDueDate: function () {
          this.set("dueDate", null);
          this.save();
        },

        editDueDate: function () {
          this.set("editingDueDate", true);
        },

        endEditingDueDate: function () {
          this.set("editingDueDate", false);
          this.save();
        },

        "delete": function () {
          this.get("model").destroyRecord();
        }
      }

    });
  });
define("x-todo/initializers/export-application-global", 
  ["ember","x-todo/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    function initialize(container, application) {
      var classifiedName = Ember.String.classify(config.modulePrefix);

      if (config.exportApplicationGlobal) {
        window[classifiedName] = application;
      }
    };
    __exports__.initialize = initialize;

    __exports__["default"] = {
      name: "export-application-global",

      initialize: initialize
    };
  });
define("x-todo/models/category", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];
    var staticEnvironment = window.XTodo.environment === "static";

    var Category = DS.Model.extend({

      name: DS.attr("string"),
      color: DS.attr("string"),
      disclosed: DS.attr("boolean"),
      index: DS.attr("number"),
      tasks: DS.hasMany("task", {
        async: staticEnvironment
      })

    });

    if (staticEnvironment) {
      Category.reopenClass({
        FIXTURES: [{
          id: 1,
          name: "Work",
          color: "#b768b7",
          disclosed: false,
          index: 0,
          tasks: [1]
        }, {
          id: 2,
          name: "Adventure",
          color: "#68b7b7",
          disclosed: false,
          index: 1,
          tasks: [2, 3]
        }, {
          id: 3,
          name: "Groceries",
          color: "#68b768",
          disclosed: false,
          index: 2,
          tasks: [4, 5, 6, 7]
        }]
      });
    }

    __exports__["default"] = Category;
  });
define("x-todo/models/task", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];
    var staticEnvironment = window.XTodo.environment === "static";

    var Task = DS.Model.extend({

      title: DS.attr("string"),
      dueDate: DS.attr("moment"),
      completed: DS.attr("boolean"),
      index: DS.attr("number"),
      category: DS.belongsTo("category")

    });

    if (staticEnvironment) {
      Task.reopenClass({
        FIXTURES: [{
          id: 1,
          title: "Get a job",
          dueDate: null,
          completed: false,
          index: 0,
          categoryId: 1
        }, {
          id: 2,
          title: "Buy a kayak and go",
          dueDate: null,
          completed: false,
          index: 0,
          categoryId: 2
        }, {
          id: 3,
          title: "Visit Yosemite",
          dueDate: null,
          completed: false,
          index: 1,
          categoryId: 2
        }, {
          id: 4,
          title: "Pink Lady apples",
          dueDate: null,
          completed: false,
          index: 0,
          categoryId: 3
        }, {
          id: 5,
          title: "Fresh mozzarella",
          dueDate: null,
          completed: false,
          index: 1,
          categoryId: 3
        }, {
          id: 6,
          title: "Roma tomatoes",
          dueDate: null,
          completed: false,
          index: 2,
          categoryId: 3
        }, {
          id: 7,
          title: "Olive oil",
          dueDate: null,
          completed: false,
          index: 3,
          categoryId: 3
        }]
      });
    }

    __exports__["default"] = Task;
  });
define("x-todo/router", 
  ["ember","x-todo/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    var Router = Ember.Router.extend({
      location: config.locationType,
      rootURL: config.rootURL
    });

    Router.map(function () {
      this.route("categories", { path: "/" });
      this.route("loading");
    });

    __exports__["default"] = Router;
  });
define("x-todo/routes/categories", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({

      model: function () {
        return this.store.find("category");
      }

    });
  });
define("x-todo/serializers/application", 
  ["ember","ember-data","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var DS = __dependency2__["default"];

    __exports__["default"] = DS.RESTSerializer.extend({

      serializeIntoHash: function (hash, type, record, options) {
        if (record.id) {
          Ember.merge(hash, { id: record.id });
        }
        return Ember.merge(hash, this.serialize(record, options));
      },

      keyForRelationship: function (key) {
        return key + "Id";
      }
    });
  });
define("x-todo/serializers/category", 
  ["x-todo/serializers/application","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var ApplicationSerializer = __dependency1__["default"];

    __exports__["default"] = ApplicationSerializer.extend({

      normalizePayload: function (payload) {
        if (payload instanceof Array) {
          var tasks = [];
          payload.forEach(function (c) {
            tasks = tasks.concat(c.tasks);
            c.tasks = c.tasks.map(function (t) {
              return t.id;
            });
          });

          return { categories: payload, tasks: tasks };
        }
        return { category: payload };
      }

    });
  });
define("x-todo/serializers/task", 
  ["x-todo/serializers/application","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var ApplicationSerializer = __dependency1__["default"];

    __exports__["default"] = ApplicationSerializer.extend({

      normalizePayload: function (payload) {
        return { task: payload };
      }

    });
  });
define("x-todo/templates/application", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.HTMLBars.template((function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","ui attached segment");
          dom.setAttribute(el1,"id","container");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h1");
          dom.setAttribute(el2,"class","ui header");
          var el3 = dom.createTextNode("X-Todo");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),2,3);
          content(env, morph0, context, "outlet");
          return fragment;
        }
      };
    }()));
  });
define("x-todo/templates/categories", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.HTMLBars.template((function() {
      var child0 = (function() {
        var child0 = (function() {
          var child0 = (function() {
            return {
              isHTMLBars: true,
              blockParams: 0,
              cachedFragment: null,
              hasRendered: false,
              build: function build(dom) {
                var el0 = dom.createDocumentFragment();
                var el1 = dom.createTextNode("        ");
                dom.appendChild(el0, el1);
                var el1 = dom.createTextNode("\n");
                dom.appendChild(el0, el1);
                return el0;
              },
              render: function render(context, env, contextualElement) {
                var dom = env.dom;
                var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
                dom.detectNamespace(contextualElement);
                var fragment;
                if (this.cachedFragment === null) {
                  fragment = this.build(dom);
                  if (this.hasRendered) {
                    this.cachedFragment = fragment;
                  } else {
                    this.hasRendered = true;
                  }
                }
                if (this.cachedFragment) {
                  fragment = dom.cloneNode(this.cachedFragment, true);
                }
                var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
                inline(env, morph0, context, "view", ["task"], {"data-id": get(env, context, "task.id"), "completed": get(env, context, "task.completed"), "overdue": get(env, context, "task.overdue"), "editing": get(env, context, "task.editing")});
                return fragment;
              }
            };
          }());
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("    ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","category-header");
              var el2 = dom.createTextNode("\n      ");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n      ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("h4");
              dom.setAttribute(el2,"class","ui header");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n      ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("a");
              dom.setAttribute(el2,"href","#");
              dom.setAttribute(el2,"class","add");
              var el3 = dom.createTextNode("+");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n      ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("div");
              dom.setAttribute(el2,"class","right icons");
              var el3 = dom.createTextNode("\n        ");
              dom.appendChild(el2, el3);
              var el3 = dom.createElement("a");
              dom.setAttribute(el3,"href","#");
              dom.setAttribute(el3,"class","delete");
              var el4 = dom.createTextNode("×");
              dom.appendChild(el3, el4);
              dom.appendChild(el2, el3);
              var el3 = dom.createTextNode("\n      ");
              dom.appendChild(el2, el3);
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n    ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n    ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("ul");
              dom.setAttribute(el1,"class","category");
              var el2 = dom.createTextNode("\n");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("    ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, inline = hooks.inline, element = hooks.element, block = hooks.block;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
              var element0 = dom.childAt(fragment, [1]);
              var element1 = dom.childAt(element0, [4]);
              var element2 = dom.childAt(element0, [6, 1]);
              var morph0 = dom.createMorphAt(element0,0,1);
              var morph1 = dom.createMorphAt(dom.childAt(element0, [2]),-1,-1);
              var morph2 = dom.createMorphAt(dom.childAt(fragment, [3]),0,1);
              inline(env, morph0, context, "color-picker", [], {"selectedColor": get(env, context, "category.color"), "updatedColorData": "updateColor", "defaultColorExcludes": get(env, context, "usedColors")});
              inline(env, morph1, context, "click-to-edit-text", [], {"value": get(env, context, "category.name"), "editing": get(env, context, "category.editing")});
              element(env, element1, context, "action", ["addTask"], {});
              element(env, element2, context, "action", ["delete"], {});
              block(env, morph2, context, "each", [get(env, context, "category.sortedTasks")], {"itemController": "task", "keyword": "task"}, child0, null);
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
            if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "view", ["category"], {"editing": get(env, context, "category.editing"), "style": get(env, context, "category.colorData.colorStyle")}, child0, null);
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","#");
          dom.setAttribute(el1,"id","remove-completed");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","icon check");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  Remove completed\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"id","add-category");
          dom.setAttribute(el1,"class","ui button");
          dom.setAttribute(el1,"aria-role","button");
          var el2 = dom.createTextNode("Add Category");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
          var element3 = dom.childAt(fragment, [0]);
          var element4 = dom.childAt(fragment, [3]);
          var morph0 = dom.createMorphAt(fragment,1,2,contextualElement);
          element(env, element3, context, "bind-attr", [], {"class": "anyCompleted::hide"});
          element(env, element3, context, "action", ["removeCompletedTasks"], {});
          block(env, morph0, context, "each", [get(env, context, "controller")], {"itemController": "category", "keyword": "category"}, child0, null);
          element(env, element4, context, "action", ["addCategory"], {});
          return fragment;
        }
      };
    }()));
  });
define("x-todo/templates/components/click-to-edit-text", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.HTMLBars.template((function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, content = hooks.content, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
          var element0 = dom.childAt(fragment, [0]);
          var element1 = dom.childAt(fragment, [2]);
          var morph0 = dom.createMorphAt(element0,-1,-1);
          var morph1 = dom.createMorphAt(element1,-1,-1);
          element(env, element0, context, "bind-attr", [], {"class": ":static editing:hide"});
          content(env, morph0, context, "value");
          element(env, element1, context, "bind-attr", [], {"class": ":ui :input editing::hide"});
          inline(env, morph1, context, "input", [], {"type": "text", "value": get(env, context, "value")});
          return fragment;
        }
      };
    }()));
  });
define("x-todo/templates/components/color-picker", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.HTMLBars.template((function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("i");
            dom.setAttribute(el2,"class","circle icon");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element, get = hooks.get;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
            var element0 = dom.childAt(fragment, [1]);
            var element1 = dom.childAt(element0, [1]);
            element(env, element0, context, "bind-attr", [], {"class": "color.selected:active :item"});
            element(env, element0, context, "action", ["pickColor", get(env, context, "color.data")], {});
            element(env, element1, context, "bind-attr", [], {"style": "color.data.colorStyle"});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("button");
          dom.setAttribute(el1,"class","ui icon top left pointing dropdown small button");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("ul");
          dom.setAttribute(el2,"class","menu");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element, get = hooks.get, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
          var element2 = dom.childAt(fragment, [0]);
          var morph0 = dom.createMorphAt(dom.childAt(element2, [1]),0,1);
          element(env, element2, context, "bind-attr", [], {"style": "selectedColorData.backgroundColorStyle"});
          block(env, morph0, context, "each", [get(env, context, "colorData")], {"keyword": "color"}, child0, null);
          return fragment;
        }
      };
    }()));
  });
define("x-todo/templates/components/date-time-field", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.HTMLBars.template((function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            inline(env, morph0, context, "native-date", [], {"type": "date", "dateBinding": "date"});
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("  ");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            inline(env, morph0, context, "date-field", [], {"class": "date", "date": get(env, context, "date")});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode(":");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, block = hooks.block, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          var morph1 = dom.createMorphAt(fragment,1,2,contextualElement);
          var morph2 = dom.createMorphAt(fragment,2,3,contextualElement);
          var morph3 = dom.createMorphAt(fragment,3,4,contextualElement);
          block(env, morph0, context, "if", [get(env, context, "isMobile")], {}, child0, child1);
          inline(env, morph1, context, "replacing-field", [], {"class": "hour", "value": get(env, context, "formattedHour"), "pattern": "[0-9]*", "advance": "advance", "advanceCharacters": "SHIFTº", "validationPattern": "^[1-9]$|^1[0-2]$"});
          inline(env, morph2, context, "replacing-field", [], {"class": "minute", "value": get(env, context, "minute"), "advance": "advance", "advanceCharacters": " ", "pattern": "[0-9]*", "validationPattern": "^[0-5]$|^[0-5][0-9]$"});
          inline(env, morph3, context, "replacing-field", [], {"class": "meridiem", "value": get(env, context, "meridiem"), "autocompleteOptions": "AM,PM"});
          return fragment;
        }
      };
    }()));
  });
define("x-todo/templates/components/native-date", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.HTMLBars.template((function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          content(env, morph0, context, "yield");
          return fragment;
        }
      };
    }()));
  });
define("x-todo/templates/components/replacing-field", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.HTMLBars.template((function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
          if (this.cachedFragment) { dom.repairClonedNode(fragment,[0]); }
          var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
          content(env, morph0, context, "yield");
          return fragment;
        }
      };
    }()));
  });
define("x-todo/templates/loading", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.HTMLBars.template((function() {
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","ui basic modal");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","content");
          var el3 = dom.createTextNode("\n    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("div");
          dom.setAttribute(el3,"class","ui active loader");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
          return fragment;
        }
      };
    }()));
  });
define("x-todo/templates/task", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.HTMLBars.template((function() {
      var child0 = (function() {
        var child0 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, get = hooks.get, inline = hooks.inline;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
              var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
              inline(env, morph0, context, "date-time-field", [], {"date": get(env, context, "task.dueDate"), "done": "endEditingDueDate"});
              return fragment;
            }
          };
        }());
        var child1 = (function() {
          return {
            isHTMLBars: true,
            blockParams: 0,
            cachedFragment: null,
            hasRendered: false,
            build: function build(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("a");
              dom.setAttribute(el1,"href","#");
              dom.setAttribute(el1,"class","overdue");
              var el2 = dom.createTextNode(" overdue");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("div");
              dom.setAttribute(el1,"class","not-overdue");
              var el2 = dom.createTextNode("\n          ");
              dom.appendChild(el1, el2);
              var el2 = dom.createElement("a");
              dom.setAttribute(el2,"href","#");
              dom.appendChild(el1, el2);
              var el2 = dom.createTextNode("\n        ");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n        ");
              dom.appendChild(el0, el1);
              var el1 = dom.createElement("a");
              dom.setAttribute(el1,"href","#");
              dom.setAttribute(el1,"class","delete");
              var el2 = dom.createTextNode("×");
              dom.appendChild(el1, el2);
              dom.appendChild(el0, el1);
              var el1 = dom.createTextNode("\n");
              dom.appendChild(el0, el1);
              return el0;
            },
            render: function render(context, env, contextualElement) {
              var dom = env.dom;
              var hooks = env.hooks, element = hooks.element, content = hooks.content;
              dom.detectNamespace(contextualElement);
              var fragment;
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
              var element1 = dom.childAt(fragment, [1]);
              var element2 = dom.childAt(fragment, [3, 1]);
              var element3 = dom.childAt(fragment, [5]);
              var morph0 = dom.createMorphAt(element1,-1,0);
              var morph1 = dom.createMorphAt(element2,-1,-1);
              element(env, element1, context, "action", ["editDueDate"], {});
              content(env, morph0, context, "task.timeOverdue");
              element(env, element2, context, "bind-attr", [], {"style": "category.colorData.colorStyle"});
              element(env, element2, context, "action", ["editDueDate"], {});
              content(env, morph1, context, "task.formattedDueDate");
              element(env, element3, context, "action", ["removeDueDate"], {});
              return fragment;
            }
          };
        }());
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, get = hooks.get, block = hooks.block;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
            if (this.cachedFragment) { dom.repairClonedNode(fragment,[0,1]); }
            var morph0 = dom.createMorphAt(fragment,0,1,contextualElement);
            block(env, morph0, context, "if", [get(env, context, "task.editingDueDate")], {}, child0, child1);
            return fragment;
          }
        };
      }());
      var child1 = (function() {
        return {
          isHTMLBars: true,
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("a");
            dom.setAttribute(el1,"href","#");
            dom.setAttribute(el1,"class","add");
            var el2 = dom.createTextNode("Add due date");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            var hooks = env.hooks, element = hooks.element;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
            var element0 = dom.childAt(fragment, [1]);
            element(env, element0, context, "bind-attr", [], {"style": "category.colorData.colorStyle"});
            element(env, element0, context, "action", ["addDueDate"], {});
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","ui checkbox");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","content");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("div");
          dom.setAttribute(el2,"class","due-date");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("  ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","right icons");
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          dom.setAttribute(el2,"href","#");
          dom.setAttribute(el2,"class","delete");
          var el3 = dom.createTextNode("×");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("i");
          dom.setAttribute(el2,"class","handle content icon");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, get = hooks.get, inline = hooks.inline, block = hooks.block, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
          var element4 = dom.childAt(fragment, [2]);
          var element5 = dom.childAt(fragment, [4, 1]);
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [0]),0,1);
          var morph1 = dom.createMorphAt(element4,0,1);
          var morph2 = dom.createMorphAt(dom.childAt(element4, [2]),0,1);
          inline(env, morph0, context, "input", [], {"type": "checkbox", "checked": get(env, context, "task.completed")});
          inline(env, morph1, context, "click-to-edit-text", [], {"class": "title", "value": get(env, context, "task.title"), "editing": get(env, context, "task.editing")});
          block(env, morph2, context, "if", [get(env, context, "task.dueDate")], {}, child0, child1);
          element(env, element5, context, "action", ["delete"], {});
          return fragment;
        }
      };
    }()));
  });
define("x-todo/tests/adapters/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - adapters');
    test('adapters/application.js should pass jshint', function() { 
      ok(true, 'adapters/application.js should pass jshint.'); 
    });
  });
define("x-todo/tests/app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('app.js should pass jshint', function() { 
      ok(true, 'app.js should pass jshint.'); 
    });
  });
define("x-todo/tests/components/click-to-edit-text.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/click-to-edit-text.js should pass jshint', function() { 
      ok(true, 'components/click-to-edit-text.js should pass jshint.'); 
    });
  });
define("x-todo/tests/components/color-picker.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/color-picker.js should pass jshint', function() { 
      ok(true, 'components/color-picker.js should pass jshint.'); 
    });
  });
define("x-todo/tests/components/date-field.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/date-field.js should pass jshint', function() { 
      ok(true, 'components/date-field.js should pass jshint.'); 
    });
  });
define("x-todo/tests/components/date-time-field.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/date-time-field.js should pass jshint', function() { 
      ok(true, 'components/date-time-field.js should pass jshint.'); 
    });
  });
define("x-todo/tests/components/native-date.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/native-date.js should pass jshint', function() { 
      ok(true, 'components/native-date.js should pass jshint.'); 
    });
  });
define("x-todo/tests/components/replacing-field.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/replacing-field.js should pass jshint', function() { 
      ok(true, 'components/replacing-field.js should pass jshint.'); 
    });
  });
define("x-todo/tests/controllers/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/application.js should pass jshint', function() { 
      ok(true, 'controllers/application.js should pass jshint.'); 
    });
  });
define("x-todo/tests/controllers/categories.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/categories.js should pass jshint', function() { 
      ok(true, 'controllers/categories.js should pass jshint.'); 
    });
  });
define("x-todo/tests/controllers/category.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/category.js should pass jshint', function() { 
      ok(true, 'controllers/category.js should pass jshint.'); 
    });
  });
define("x-todo/tests/controllers/editable-object.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/editable-object.js should pass jshint', function() { 
      ok(true, 'controllers/editable-object.js should pass jshint.'); 
    });
  });
define("x-todo/tests/controllers/task.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/task.js should pass jshint', function() { 
      ok(true, 'controllers/task.js should pass jshint.'); 
    });
  });
define("x-todo/tests/helpers/resolver", 
  ["ember/resolver","x-todo/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var config = __dependency2__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix
    };

    __exports__["default"] = resolver;
  });
define("x-todo/tests/helpers/start-app", 
  ["ember","x-todo/app","x-todo/router","x-todo/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Application = __dependency2__["default"];
    var Router = __dependency3__["default"];
    var config = __dependency4__["default"];

    __exports__["default"] = function startApp(attrs) {
      var application;

      var attributes = Ember.merge({}, config.APP);
      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

      Ember.run(function () {
        application = Application.create(attributes);
        application.setupForTesting();
        application.injectTestHelpers();
      });

      return application;
    }
  });
define("x-todo/tests/models/category.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/category.js should pass jshint', function() { 
      ok(true, 'models/category.js should pass jshint.'); 
    });
  });
define("x-todo/tests/models/task.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/task.js should pass jshint', function() { 
      ok(true, 'models/task.js should pass jshint.'); 
    });
  });
define("x-todo/tests/router.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('router.js should pass jshint', function() { 
      ok(true, 'router.js should pass jshint.'); 
    });
  });
define("x-todo/tests/routes/categories.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/categories.js should pass jshint', function() { 
      ok(true, 'routes/categories.js should pass jshint.'); 
    });
  });
define("x-todo/tests/serializers/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - serializers');
    test('serializers/application.js should pass jshint', function() { 
      ok(true, 'serializers/application.js should pass jshint.'); 
    });
  });
define("x-todo/tests/serializers/category.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - serializers');
    test('serializers/category.js should pass jshint', function() { 
      ok(true, 'serializers/category.js should pass jshint.'); 
    });
  });
define("x-todo/tests/serializers/task.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - serializers');
    test('serializers/task.js should pass jshint', function() { 
      ok(true, 'serializers/task.js should pass jshint.'); 
    });
  });
define("x-todo/tests/test-helper", 
  ["x-todo/tests/helpers/resolver","ember-qunit"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var resolver = __dependency1__["default"];
    var setResolver = __dependency2__.setResolver;

    setResolver(resolver);

    document.write("<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>");

    QUnit.config.urlConfig.push({ id: "nocontainer", label: "Hide container" });
    var containerVisibility = QUnit.urlParams.nocontainer ? "hidden" : "visible";
    document.getElementById("ember-testing-container").style.visibility = containerVisibility;
  });
define("x-todo/tests/transforms/moment.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - transforms');
    test('transforms/moment.js should pass jshint', function() { 
      ok(true, 'transforms/moment.js should pass jshint.'); 
    });
  });
define("x-todo/tests/unit/adapters/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("adapter:application", "ApplicationAdapter", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var adapter = this.subject();
      ok(adapter);
    });
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });
define("x-todo/tests/unit/components/click-to-edit-date-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("click-to-edit-date", "ClickToEditDateComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("x-todo/tests/unit/components/click-to-edit-text-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("click-to-edit-text", "ClickToEditTextComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("x-todo/tests/unit/components/color-picker-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("color-picker", "ColorPickerComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("x-todo/tests/unit/components/date-field-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("date-field", "DateFieldComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("x-todo/tests/unit/components/date-time-field-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("date-time-field", "DateTimeFieldComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("x-todo/tests/unit/components/native-date-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("native-date", "NativeDateComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("x-todo/tests/unit/components/replacing-field-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("replacing-field", "ReplacingFieldComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("x-todo/tests/unit/components/time-field-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("time-field", "TimeFieldComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("x-todo/tests/unit/controllers/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:application", "ApplicationController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("x-todo/tests/unit/controllers/categories-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:categories", "CategoriesController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("x-todo/tests/unit/controllers/category-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:category", "CategoryController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("x-todo/tests/unit/controllers/editable-object-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:editable-object", "EditableObjectController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("x-todo/tests/unit/controllers/task-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:task", "TaskController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("x-todo/tests/unit/models/category-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("category", "Category", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("x-todo/tests/unit/models/task-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("task", "Task", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("x-todo/tests/unit/routes/categories-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:categories", "CategoriesRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("x-todo/tests/unit/serializers/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("serializer:application", "ApplicationSerializer", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var serializer = this.subject();
      ok(serializer);
    });
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });
define("x-todo/tests/unit/serializers/category-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("serializer:category", "CategorySerializer", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var serializer = this.subject();
      ok(serializer);
    });
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });
define("x-todo/tests/unit/serializers/task-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("serializer:task", "TaskSerializer", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var serializer = this.subject();
      ok(serializer);
    });
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });
define("x-todo/tests/unit/transforms/moment-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("transform:moment", "MomentTransform", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var transform = this.subject();
      ok(transform);
    });
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });
define("x-todo/tests/unit/views/category-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("view:category", "CategoryView");

    // Replace this with your real tests.
    test("it exists", function () {
      var view = this.subject();
      ok(view);
    });
  });
define("x-todo/tests/unit/views/loading-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("view:categories-loading", "CategoriesLoadingView");

    // Replace this with your real tests.
    test("it exists", function () {
      var view = this.subject();
      ok(view);
    });
  });
define("x-todo/tests/unit/views/task-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("view:task", "TaskView");

    // Replace this with your real tests.
    test("it exists", function () {
      var view = this.subject();
      ok(view);
    });
  });
define("x-todo/tests/views/category.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - views');
    test('views/category.js should pass jshint', function() { 
      ok(true, 'views/category.js should pass jshint.'); 
    });
  });
define("x-todo/tests/views/loading.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - views');
    test('views/loading.js should pass jshint', function() { 
      ok(true, 'views/loading.js should pass jshint.'); 
    });
  });
define("x-todo/tests/views/task.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - views');
    test('views/task.js should pass jshint', function() { 
      ok(true, 'views/task.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/helpers/resolver.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/helpers');
    test('x-todo/tests/helpers/resolver.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/helpers/resolver.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/helpers/start-app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/helpers');
    test('x-todo/tests/helpers/start-app.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/helpers/start-app.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/test-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests');
    test('x-todo/tests/test-helper.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/test-helper.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/adapters/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/adapters');
    test('x-todo/tests/unit/adapters/application-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/adapters/application-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/components/click-to-edit-date-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/components');
    test('x-todo/tests/unit/components/click-to-edit-date-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/components/click-to-edit-date-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/components/click-to-edit-text-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/components');
    test('x-todo/tests/unit/components/click-to-edit-text-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/components/click-to-edit-text-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/components/color-picker-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/components');
    test('x-todo/tests/unit/components/color-picker-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/components/color-picker-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/components/date-field-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/components');
    test('x-todo/tests/unit/components/date-field-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/components/date-field-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/components/date-time-field-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/components');
    test('x-todo/tests/unit/components/date-time-field-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/components/date-time-field-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/components/native-date-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/components');
    test('x-todo/tests/unit/components/native-date-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/components/native-date-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/components/replacing-field-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/components');
    test('x-todo/tests/unit/components/replacing-field-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/components/replacing-field-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/components/time-field-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/components');
    test('x-todo/tests/unit/components/time-field-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/components/time-field-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/controllers/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/controllers');
    test('x-todo/tests/unit/controllers/application-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/controllers/application-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/controllers/categories-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/controllers');
    test('x-todo/tests/unit/controllers/categories-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/controllers/categories-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/controllers/category-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/controllers');
    test('x-todo/tests/unit/controllers/category-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/controllers/category-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/controllers/editable-object-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/controllers');
    test('x-todo/tests/unit/controllers/editable-object-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/controllers/editable-object-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/controllers/task-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/controllers');
    test('x-todo/tests/unit/controllers/task-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/controllers/task-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/models/category-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/models');
    test('x-todo/tests/unit/models/category-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/models/category-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/models/task-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/models');
    test('x-todo/tests/unit/models/task-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/models/task-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/routes/categories-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/routes');
    test('x-todo/tests/unit/routes/categories-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/routes/categories-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/serializers/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/serializers');
    test('x-todo/tests/unit/serializers/application-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/serializers/application-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/serializers/category-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/serializers');
    test('x-todo/tests/unit/serializers/category-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/serializers/category-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/serializers/task-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/serializers');
    test('x-todo/tests/unit/serializers/task-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/serializers/task-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/transforms/moment-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/transforms');
    test('x-todo/tests/unit/transforms/moment-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/transforms/moment-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/views/category-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/views');
    test('x-todo/tests/unit/views/category-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/views/category-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/views/loading-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/views');
    test('x-todo/tests/unit/views/loading-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/views/loading-test.js should pass jshint.'); 
    });
  });
define("x-todo/tests/x-todo/tests/unit/views/task-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - x-todo/tests/unit/views');
    test('x-todo/tests/unit/views/task-test.js should pass jshint', function() { 
      ok(true, 'x-todo/tests/unit/views/task-test.js should pass jshint.'); 
    });
  });
define("x-todo/transforms/moment", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global moment */
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.Transform.extend({
      deserialize: function (serialized) {
        if (serialized) {
          return moment.utc(serialized).local();
        }
        return null;
      },

      serialize: function (deserialized) {
        if (deserialized) {
          var serialized = deserialized.utc().format();
          deserialized.local();
          return serialized;
        }
        return null;
      }
    });
  });
define("x-todo/views/category", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global $ */

    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.View.extend({

      classNameBindings: ["editing"],
      attributeBindings: ["style"],

      didInsertElement: function () {
        this.$("ul.category").sortable({
          axis: "y",
          connectWith: ".category",
          update: this.get("didReorderTasks").bind(this),
          receive: this.get("didMoveTaskIn").bind(this)
        });
      },

      didReorderTasks: function () {
        var indexHash = {};
        this.$("ul.category > li").each(function (i, item) {
          indexHash[$(item).data("id").toString()] = i;
        });

        this.get("controller").send("updateTaskIndexes", indexHash);
        this.rerender();
      },

      didMoveTaskIn: function (event, ui) {
        this.get("controller").send("updateTaskCategory", ui.item.data("id"));
      }

    });
  });
define("x-todo/views/loading", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global $ */

    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.View.extend({

      didInsertElement: function () {
        $("#container").addClass("loading");
      },

      willDestroyElement: function () {
        $("#container").removeClass("loading");
      }

    });
  });
define("x-todo/views/task", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.View.extend({

      templateName: "task",
      tagName: "li",
      attributeBindings: ["data-id"],
      classNames: ["task"],
      classNameBindings: ["completed", "overdue", "editing"],

      didInsertElement: function () {
        this.$(".ui.checkbox").checkbox();
      }

    });
  });
/* jshint ignore:start */

define('x-todo/config/environment', ['ember'], function(Ember) {
  var prefix = 'x-todo';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("x-todo/tests/test-helper");
} else {
  require("x-todo/app")["default"].create({"environment":"static"});
}

/* jshint ignore:end */
//# sourceMappingURL=x-todo.map