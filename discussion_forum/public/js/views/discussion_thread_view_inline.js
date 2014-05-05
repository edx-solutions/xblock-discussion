// Generated by CoffeeScript 1.6.1
(function() {
  var _this = this,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof Backbone !== "undefined" && Backbone !== null) {
    this.DiscussionThreadInlineView = (function(_super) {
      var expanded;

      __extends(DiscussionThreadInlineView, _super);

      function DiscussionThreadInlineView() {
        var _this = this;
        this.expandPost = function(event) {
          return DiscussionThreadInlineView.prototype.expandPost.apply(_this, arguments);
        };
        return DiscussionThreadInlineView.__super__.constructor.apply(this, arguments);
      }

      expanded = false;

      DiscussionThreadInlineView.prototype.events = {
        "click .discussion-submit-post": "submitComment",
        "click .expand-post": "expandPost",
        "click .collapse-post": "collapsePost",
        "click .add-response-btn": "scrollToAddResponse"
      };

      DiscussionThreadInlineView.prototype.initialize = function() {
        return DiscussionThreadInlineView.__super__.initialize.call(this);
      };

      DiscussionThreadInlineView.prototype.initLocal = function() {
        this.$local = this.$el.children(".discussion-article").children(".local");
        if (!this.$local.length) {
          this.$local = this.$el;
        }
        return this.$delegateElement = this.$local;
      };

      DiscussionThreadInlineView.prototype.render = function() {
        var params;
        if (this.model.has('group_id')) {
          this.template = DiscussionUtil.getTemplate("_inline_thread_cohorted");
        } else {
          this.template = DiscussionUtil.getTemplate("_inline_thread");
        }
        if (!this.model.has('abbreviatedBody')) {
          this.abbreviateBody();
        }
        params = this.model.toJSON();
        this.$el.html(Mustache.render(this.template, params));
        this.initLocal();
        this.delegateEvents();
        this.renderShowView();
        this.renderAttrs();
        this.$("span.timeago").timeago();
        this.$el.find('.post-extended-content').hide();
        if (this.expanded) {
          this.makeWmdEditor("reply-body");
          this.renderAddResponseButton();
          this.renderResponses();
        }
        return this;
      };

      DiscussionThreadInlineView.prototype.createShowView = function() {
        if (this.editView != null) {
          this.editView.undelegateEvents();
          this.editView.$el.empty();
          this.editView = null;
        }
        this.showView = new DiscussionThreadInlineShowView({
          model: this.model
        });
        this.showView.bind("thread:_delete", this._delete);
        return this.showView.bind("thread:edit", this.edit);
      };

      DiscussionThreadInlineView.prototype.renderResponses = function() {
        var _this = this;
        return DiscussionUtil.safeAjax({
          url: "/courses/" + $$course_id + "/discussion/forum/" + (this.model.get('commentable_id')) + "/threads/" + this.model.id,
          $loading: this.$el,
          success: function(data, textStatus, xhr) {
            var comments;
            Content.loadContentInfos(data['annotated_content_info']);
            comments = new Comments(data['content']['children']);
            comments.each(_this.renderResponse);
            _this.trigger("thread:responses:rendered");
            return _this.$('.loading').remove();
          }
        });
      };

      DiscussionThreadInlineView.prototype.toggleClosed = function(event) {
        var $elem, closed, data, url,
          _this = this;
        $elem = $(event.target);
        url = this.model.urlFor('close');
        closed = this.model.get('closed');
        data = {
          closed: !closed
        };
        return DiscussionUtil.safeAjax({
          $elem: $elem,
          url: url,
          data: data,
          type: "POST",
          success: function(response, textStatus) {
            _this.model.set('closed', !closed);
            return _this.model.set('ability', response.ability);
          }
        });
      };

      DiscussionThreadInlineView.prototype.toggleEndorse = function(event) {
        var $elem, data, endorsed, url,
          _this = this;
        $elem = $(event.target);
        url = this.model.urlFor('endorse');
        endorsed = this.model.get('endorsed');
        data = {
          endorsed: !endorsed
        };
        return DiscussionUtil.safeAjax({
          $elem: $elem,
          url: url,
          data: data,
          type: "POST",
          success: function(response, textStatus) {
            return _this.model.set('endorsed', !endorsed);
          }
        });
      };

      DiscussionThreadInlineView.prototype.abbreviateBody = function() {
        var abbreviated;
        abbreviated = DiscussionUtil.abbreviateString(this.model.get('body'), 140);
        return this.model.set('abbreviatedBody', abbreviated);
      };

      DiscussionThreadInlineView.prototype.expandPost = function(event) {
        this.expanded = true;
        this.$el.addClass('expanded');
        this.$el.find('.post-body').html(this.model.get('body'));
        this.showView.convertMath();
        this.$el.find('.expand-post').css('display', 'none');
        this.$el.find('.collapse-post').css('display', 'block');
        this.$el.find('.post-extended-content').show();
        this.makeWmdEditor("reply-body");
        this.renderAttrs();
        if (this.$el.find('.loading').length) {
          this.renderAddResponseButton();
          return this.renderResponses();
        }
      };

      DiscussionThreadInlineView.prototype.collapsePost = function(event) {
        this.expanded = false;
        this.$el.removeClass('expanded');
        this.$el.find('.post-body').html(this.model.get('abbreviatedBody'));
        this.showView.convertMath();
        this.$el.find('.collapse-post').css('display', 'none');
        this.$el.find('.post-extended-content').hide();
        return this.$el.find('.expand-post').css('display', 'block');
      };

      DiscussionThreadInlineView.prototype.createEditView = function() {
        DiscussionThreadInlineView.__super__.createEditView.call(this);
        this.editView.bind("thread:update", this.expandPost);
        this.editView.bind("thread:update", this.abbreviateBody);
        return this.editView.bind("thread:cancel_edit", this.expandPost);
      };

      return DiscussionThreadInlineView;

    })(DiscussionThreadView);
  }

}).call(this);
