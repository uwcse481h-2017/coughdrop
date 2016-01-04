import Ember from 'ember';
import capabilities from '../utils/capabilities';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';
import i18n from '../utils/i18n';
import stashes from '../utils/_stashes';

export default Ember.Controller.extend(LoginControllerMixin, {
  title: "Login"
});
