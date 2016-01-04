import modal from '../utils/modal';

export default modal.ModalController.extend({
  sorted_buttons: function() {
    var words = this.get('model.button_set.buttons') || [];
    words.forEach(function(b) {
      b.label = b.vocalization || b.label;
    });
    words = words.sort(function(a, b) { if(a.label < b.label) { return -1; } else if(a.label > b.label) { return 1; } else { return 0; } });
    return words;
  }.property('model.button_set.buttons'),
  actions: {
    download_list: function() {
      var element = document.createElement('a');
      var words = this.get('sorted_buttons').mapBy('label').uniq();
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(words.join("\n")));
      element.setAttribute('download', this.get('model.board.key').replace(/\//, '-') + '-words.txt');

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }
  }
});