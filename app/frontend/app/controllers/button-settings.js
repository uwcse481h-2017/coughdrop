import Ember from 'ember';
import modal from '../utils/modal';
import editManager from '../utils/edit_manager';
import contentGrabbers from '../utils/content_grabbers';
import stashes from '../utils/_stashes';
import i18n from '../utils/i18n';
import CoughDrop from '../app';
import utterance from '../utils/utterance';
import app_state from '../utils/app_state';
import boundClasses from '../utils/bound_classes';
import Button from '../utils/button';
import Utils from '../utils/misc';
import linkButton from '../mixins/link-button';

// Extends the linkButton mixin, which currently only holds logic to
// get supervisees needed when linking a button to another board.
export default modal.ModalController.extend(linkButton, {
  opening: function() {
    var button = this.get('model.button');
    this.set('board', this.get('model.board'));
    this.set('model', button);
    this.set('handle_updates', true);
    contentGrabbers.setup(button, this);

    contentGrabbers.check_for_dropped_file();
    var state = button.state || 'general';
    this.set('state', state);
    this.set('original_image_license', Ember.$.extend({}, button.get('image.license')));
    this.set('original_sound_license', Ember.$.extend({}, button.get('sound.license')));
    this.set('board_search_type', stashes.get('last_board_search_type') || "personal");
    this.set('image_library', null);

    // Get Supervisees info needed to link a button to another board.
    // Handled in linkButton mixin.
    this.get_supervisees();
  },
  closing: function() {
    stashes.set('last_board_search_type', this.get('board_search_type'));
//    editManager.done_editing_image();
    contentGrabbers.clear();
  },
  labelChanged: function() {
    if(!this.get('handle_updates')) { return; }
    editManager.change_button(this.get('model.id'), {
      label: this.get('model.label')
    });
  }.observes('model.label'),
  buttonActions: function() {
    var res = [
      {name: i18n.t('talk', "Add button to the vocalization window"), id: "talk"},
      {name: i18n.t('folder', "Open/Link to another board"), id: "folder"},
      {name: i18n.t('link', "Open a web site in a browser tab"), id: "link"},
      {name: i18n.t('app', "Launch an application"), id: "app"}
    ];
    if(app_state.get('feature_flags.app_connections')) {
      res.push({name: i18n.t('integration', "Activate a connected tool"), id: "integration"});
    }
    return res;
  }.property('app_state.feature_flags.app_connections'),
  tool_action_types: function() {
    return [
      {name: i18n.t('trigger_webhook', "Trigger an external action"), id: 'webhook'},
      {name: i18n.t('render_page', "Load a tool-rendered page"), id: 'render'}
    ];
  }.property(),
  image_libraries: function() {
    var res = [
      {name: i18n.t('open_symbols', "opensymbols.org (default)"), id: 'opensymbols'}
    ];
    if(window.flickr_key) {
      res.push({name: i18n.t('flickr', "Flickr Creative Commons"), id: 'flickr'});
    }
    if(window.custom_search_key) {
      res.push({name: i18n.t('public_domain', "Public Domain Images"), id: 'public_domain'});
    }
    if(window.pixabay_key) {
      res.push({name: i18n.t('pixabay_photos', "Pixabay Photos"), id: 'pixabay_photos'});
      res.push({name: i18n.t('pixabay_vectors', "Pixabay Vector Images"), id: 'pixabay_vectors'});
    }
//    res.push({name: i18n.t('openclipart', "OpenClipart"), id: 'openclipart'});

    if(res.length == 1) { return []; }
    return res;
  }.property(),
  load_user_integrations: function() {
    var user_id = this.get('model.integration_user_id') || 'self';
    var _this = this;
    if(this.get('model.integrationAction')) {
      _this.set('user_integrations', {loading: true});
      Utils.all_pages('integration', {user_id: user_id, for_button: true}, function() {
      }).then(function(res) {
        _this.set('user_integrations', res);
      }, function(err) {
        _this.set('user_integrations', {error: true});
      });
    } else {
      _this.set('user_integrations', []);
    }
  }.observes('model.integrationAction', 'model.integration_user_id'),
  parts_of_speech: function() {
    return CoughDrop.parts_of_speech;
  }.property(),
  licenseOptions: function() {
    return CoughDrop.licenseOptions;
  }.property(),
  board_search_options: function() {
    var res = [];
    if(this.get('board.user_name') != app_state.get('currentUser.user_name')) {
      res.push({name: i18n.t('their_boards', "This User's Boards (includes shared)"), id: 'current_user'});
      res.push({name: i18n.t('public_boards', "Public Boards"), id: 'public'});
      res.push({name: i18n.t('their_starred_boards', "This User's Liked Boards"), id: 'current_user_starred'});
      res.push({name: i18n.t('my_public_boards', "My Public Boards"), id: 'personal_public'});
      res.push({name: i18n.t('my_public_boards', "My Liked Public Boards"), id: 'personal_public_starred'});

    } else {
      res.push({name: i18n.t('my_boards', "My Boards (includes shared)"), id: 'personal'});
      res.push({name: i18n.t('public_boards', "Public Boards"), id: 'public'});
      res.push({name: i18n.t('starred_boards', "My Liked Boards"), id: 'personal_starred'});
    }
    return res;
  }.property('board.user_name'),
  webcam_unavailable: function() {
    return !contentGrabbers.pictureGrabber.webcam_available();
  }.property(),
  recorder_unavailable: function() {
    return !contentGrabbers.soundGrabber.recorder_available();
  }.property(),
  notSetPrivateImageLicense: function() {
    if(this.get('image_preview.license')) {
      this.set('image_preview.license.private', this.get('image_preview.license.type') == 'private');
    }
    if(this.get('model.image.license')) {
      this.set('model.image.license.private', this.get('model.image.license.type') == 'private');
    }
  }.observes('image_preview', 'image_preview.license.type', 'model.image.license.type'),
  notSetPrivateSoundLicense: function() {
    if(this.get('sound_preview.license')) {
      this.set('sound_preview.license.private', this.get('sound_preview.license.type') == 'private');
    }
    if(this.get('model.sound.license')) {
      this.set('model.sound.license.private', this.get('model.sound.license.type') == 'private');
    }
  }.observes('sound_preview', 'sound_preview.license.type', 'model.sound.license', 'model.sound.license.type'),
  generateButtonStyle: function() {
    boundClasses.add_rule({
      background_color: this.get('model.background_color'),
      border_color: this.get('model.border_color')
    });
    boundClasses.add_classes(this.get('model'));
  }.observes('model.background_color', 'model.border_color'),
  focus_on_state_change: function() {
    Ember.run.later(function() {
      var $elem = Ember.$(".modal-body:visible .content :input:visible:first");
      $elem.focus().select();
    });
  }.observes('state'),
  re_find: function() {
    if(this.get('linkedBoardName')) {
      this.send('find_board');
    }
  }.observes('board_search_type'),
  state: 'general',
  generalState: function() {
    return this.get('state') == 'general';
  }.property('state'),
  pictureState: function() {
    return this.get('state') == 'picture';
  }.property('state'),
  actionState: function() {
    return this.get('state') == 'action';
  }.property('state'),
  soundState: function() {
    return this.get('state') == 'sound';
  }.property('state'),
  special_modifier: function() {
    var voc = this.get('model.vocalization');
    if([':clear', ':home', ':back', ':backspace', ':beep', ':speak'].indexOf(voc) >= 0) {
      if(voc == ':clear') {
        return i18n.t('clear_utterance', "Clear the current utterance");
      } else if(voc == ':home') {
        return i18n.t('home', "Jump to the current home board");
      } else if(voc == ':back') {
        return i18n.t('back', "Go back one board");
      } else if(voc == ':backspace') {
        return i18n.t('backspace', "Erase the last button from the utterance");
      } else if(voc == ':beep') {
        return i18n.t('beep', "Beep");
      } else if(voc == ':speak') {
        return i18n.t('speak', "Speak the full utterance");
      }
    }
    return null;
  }.property('model.vocalization'),
  modifier: function() {
    var str = Ember.get(this, 'model.vocalization') || Ember.get(this, 'model.label') || "";
    return str.match(/^\+|:/) && str;
  }.property('model.label', 'model.vocalization'),
  ios_search: function() {
    return this.get('app_find_mode') == 'ios' || !this.get('app_find_mode');
  }.property('app_find_mode'),
  android_search: function() {
    return this.get('app_find_mode') == 'android';
  }.property('app_find_mode'),
  web_search: function() {
    return this.get('app_find_mode') == 'web';
  }.property('app_find_mode'),
  track_video: function() {
    if(this.get('model.video.popup') && this.get('model.video.test_url') && !this.get('player')) {
      var _this = this;
      CoughDrop.YT.track('link_video_preview').then(function(player) {
        _this.set('player', player);
      });
    }
  }.observes('model.video.popup', 'model.video.test_url'),
  ios_status_class: function() {
    var res = "glyphicon ";
    if(this.get('model.apps.ios')) {
      res = res + "glyphicon-check ";
    } else {
      res = res + "glyphicon-unchecked ";
    }
    return res;
  }.property('model.apps.ios'),
  android_status_class: function() {
    var res = "glyphicon ";
    if(this.get('model.apps.android')) {
      res = res + "glyphicon-check ";
    } else {
      res = res + "glyphicon-unchecked ";
    }
    return res;
  }.property('model.apps.android'),
  web_status_class: function() {
    var res = "glyphicon ";
    if(this.get('model.apps.web.launch_url')) {
      res = res + "glyphicon-check ";
    } else {
      res = res + "glyphicon-unchecked ";
    }
    return res;
  }.property('model.apps.web.launch_url'),
  fake_button_class: function() {
    var res = "fake_button ";
    if(this.get('model.display_class')) {
      res = res + this.get('model.display_class') + " ";
    }
    return res;
  }.property('model.display_class'),
  webcam_class: function() {
    var res = "button_image ";
    if(this.get('webcam.snapshot')) {
      res = res + "hidden ";
    } else {
      res = res + "shown ";
    }
    return res;
  }.property('webcam.snapshot'),
  show_libraries: function() {
    var previews = this.get('image_search.previews');
    return (previews && previews.length > 0) || this.get('image_search.previews_loaded');
  }.property('image_search.previews', 'image_search.previews_loaded'),
  actions: {
    nothing: function() {
      // I had some forms that were being used mainly for layout and I couldn't
      // figure out other than this how to get them to stop submitting when the
      // enter key was hit in some text fields. Weird thing was it wasn't all text
      // fields..
    },
    toggle_color: function(type) {
      var $elem = Ember.$("#" + type);

      if(!$elem.hasClass('minicolors-input')) {
        $elem.minicolors();
      }
      if($elem.next().next(".minicolors-panel:visible").length > 0) {
        $elem.minicolors('hide');
      } else {
        $elem.minicolors('show');
      }
    },
    setState: function(state) {
      this.set('state', state);
    },
    clear_button: function() {
      editManager.clear_button(this.get('model.id'));
      modal.close(true);
    },
    swapButton: function() {
      editManager.prep_for_swap(this.get('model.id'));
      modal.close(true);
    },
    stash_button: function() {
      editManager.stash_button(this.get('model.id'));
      this.set('stashed', true);
    },
    webcamPicture: function() {
      contentGrabbers.pictureGrabber.start_webcam();
    },
    swapStreams: function() {
      contentGrabbers.pictureGrabber.swap_streams();
    },
    webcamToggle: function(takePic) {
      contentGrabbers.pictureGrabber.toggle_webcam(!takePic);
    },
    find_board: function() {
      contentGrabbers.boardGrabber.find_board();
    },
    build_board: function() {
      contentGrabbers.boardGrabber.build_board();
    },
    plus_minus: function(direction, attribute) {
      var value = parseInt(this.get(attribute), 10);
      if(direction == 'minus') {
        value = value - 1;
      } else {
        value = value + 1;
      }
      value = Math.min(Math.max(1, value), 20);
      this.set(attribute, value);
    },
    cancel_build_board: function() {
      contentGrabbers.boardGrabber.cancel_build_board();
    },
    selectFoundBoard: function(board, force) {
      contentGrabbers.boardGrabber.pick_board(board, force);
    },
    copy_found_board: function() {
      contentGrabbers.boardGrabber.copy_found_board();
    },
    create_board: function() {
      contentGrabbers.boardGrabber.create_board();
    },
    clearImageWork: function() {
      contentGrabbers.pictureGrabber.clear();
    },
    clear_image_preview: function() {
      contentGrabbers.pictureGrabber.clear_image_preview();
    },
    clear_sound_work: function() {
      contentGrabbers.soundGrabber.clear_sound_work();
    },
    clear_sound: function() {
      this.set('model.sound', null);
    },
    pick_preview: function(preview) {
      contentGrabbers.pictureGrabber.pick_preview(preview);
    },
    find_picture: function() {
      var text = this.get('model.image_field');
      if(!text) {
        this.set('model.image_field', this.get('model.label'));
        text = this.get('model.label');
      }
      contentGrabbers.pictureGrabber.find_picture(text);
    },
    edit_image_preview: function() {
      contentGrabbers.pictureGrabber.edit_image_preview();
    },
    edit_image: function() {
      contentGrabbers.pictureGrabber.edit_image();
    },
    word_art: function() {
      var text = this.get('model.image_field') || this.get('model.vocalization') || this.get('model.label');
      contentGrabbers.pictureGrabber.word_art(text);
    },
    clear_image: function() {
      contentGrabbers.pictureGrabber.clear_image();
    },
    select_image_preview: function(url) {
      contentGrabbers.pictureGrabber.select_image_preview(url);
    },
    testVocalization: function() {
      var text = this.get('model.vocalization') || this.get('model.label');
      if(this.get('modifier') && this.get('modifier_text')) {
        var b = Button.create({label: this.get('modifier_text')});
        var m = Button.create({label: this.get('modifier')});
        var res = utterance.modify_button(b, m);
        utterance.speak_text(res.get('label'));
      } else {
        utterance.speak_text(text);
      }
    },
    record_sound: function() {
      contentGrabbers.soundGrabber.record_sound();
    },
    toggle_recording_sound: function(action) {
      contentGrabbers.soundGrabber.toggle_recording_sound(action);
    },
    select_sound_preview: function() {
      contentGrabbers.soundGrabber.select_sound_preview();
    },
    close: function() {
      if(this.get('model.vocalization')) {
        this.send('clear_sound');
        this.send('clear_sound_work');
        this.set('model.sound_id', null);
      }
      contentGrabbers.save_pending().then(function() {
        modal.close();
      }, function() {
        modal.close();
      });
    },
    find_app: function() {
      contentGrabbers.linkGrabber.find_apps();
    },
    pick_app: function(app) {
      contentGrabbers.linkGrabber.pick_app(app);
    },
    set_app_find_mode: function(mode) {
      contentGrabbers.linkGrabber.set_app_find_mode(mode);
    },
    set_custom: function() {
      contentGrabbers.linkGrabber.set_custom();
    },
    set_time: function(time_attr) {
      if(this.get('player')) {
        var time = Math.round(this.get('player').current_time());
        if(time) {
          this.get('model').set('video.' + time_attr, time);
        }
      }
    },
    clear_times: function() {
      this.get('model').setProperties({
        'video.start': '',
        'video.end': ''
      });
    },
    select_integration: function(tool) {
      (this.get('user_integrations') || []).forEach(function(i) {
        Ember.set(i, 'selected', false);
      });
      var action_type = (!tool.get('has_multiple_actions') && tool.get('render')) ? 'render' : 'webhook';
      this.set('model.integration', {
        user_integration_id: tool.id,
        action_type: action_type
      });
      this.set('selected_integration', tool);
      Ember.set(tool, 'selected', true);
    }
  }
});
