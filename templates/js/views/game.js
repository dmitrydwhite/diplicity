window.GameView = BaseView.extend({

  template: _.template($('#game_underscore').html()),

	initialize: function(options) {
	  _.bindAll(this, 'doRender', 'provinceClicked');
		this.listenTo(this.model, 'change', this.doRender);
		this.fetch(this.model);
		this.cleaners = [];
	},

	provinceClicked: function(prov) {
	  logInfo('clicked', prov);
	},

	renderMap: function(handler) {
	  var that = this;
		var phase = that.model.get('Phase');
		var variant = that.model.get('Variant');
		_.each(that.cleaners, function(cleaner) {
		  cleaner();
		});
		that.cleaners = [];
	  if (phase != null) {
			$('.map').copySVG(variant + 'Map');
			_.each(phase.Units, function(val, key) {
			  $('.map svg').addUnit(variant + 'Unit' + val.Type, key, variantColor(variant, val.Nation));
			});
			_.each(variantColorizableProvincesMap[variant], function(key) {
				if (phase.SupplyCenters[key] == null) {
					$('.map svg').hideProvince(key);
				} else {
					$('.map svg').colorProvince(key, variantColor(variant, phase.SupplyCenters[key]));
				}
			});
			_.each(variantClickableProvincesMap[variant], function(key) {
				that.cleaners.push($('.map' + ' svg').addCopyClickListener(key, function(ev) {
				  handler(key);
				}));
			});
			$('.map svg').find('#provinces')[0].removeAttribute('style');
		}
	},

  render: function() {
		var that = this;
		navLinks([]);
		that.$el.html(that.template({ 
		}));
		if (this.model.get('Members') != null) {
			var state_view = new GameStateView({ 
				parentId: 'current_game',
				play_state: true,
				editable: false,
				model: that.model,
			}).doRender();
			that.$('#current_game').append(state_view.el);
		}
		that.renderMap(this.provinceClicked);
		panZoom('.map');
		return that;
	},

});
