window.CreateGameView = BaseView.extend({

  template: _.template($('#create_game_underscore').html()),

	initialize: function(options) {
	  _.bindAll(this, 'doRender');
		this.listenTo(window.session.user, 'change', this.doRender);
		var deadlines = {};
		var chatFlags = {};
		_.each(phaseTypes(defaultVariant), function(type) {
		  deadlines[type] = defaultDeadline;
      chatFlags[type] = defaultChatFlags;
		});
		var game = {
			Private: false,
		  Variant: defaultVariant,
			Deadlines: deadlines,
			ChatFlags: chatFlags,
		};
		this.gameMember = new GameMember({
		  User: btoa(window.session.user.get('Email')),
		  Game: game
		});
		this.gameMember.url = '/games';
	},

  render: function() {
		var that = this;
		that.$el.html(that.template({
		  user: window.session.user,
		}));
		if (window.session.user.loggedIn()) {
			new GameMemberView({ 
				el: that.$('.create-game'),
				editable: true,
				model: that.gameMember,
				button_text: '{{.I "Create" }}',
				button_action: function() {
					that.gameMember.save(null, {
						success: function() {
							console.log('save successful');
							window.session.router.navigate('', { trigger: true });
						},
					});
				},
			}).doRender();
		}
		return that;
	},

});
