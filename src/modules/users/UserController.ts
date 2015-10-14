module Users {
 

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
  class UserController {

    selected;
    users;
    toggleList;

    constructor(private userService, private $mdSidenav, private $mdBottomSheet, private $log, private $q) {
      var self = this;

      self.selected = null;
      self.users = [];

      // Load all registered users
      userService
        .loadAllUsers()
        .then(function(users) {
          self.users = [].concat(users);
          self.selected = users[0];
        });
    }
    // *********************************
    // Internal methods
    // *********************************

    /**
     * First hide the bottomsheet IF visible, then
     * hide or Show the 'left' sideNav area
     */
    public toggleUsersList() {
      var pending = this.$mdBottomSheet.hide() || this.$q.when(true);

      pending.then(function() {
        this.$mdSidenav('left').toggle();
      });
    }

    /**
     * Select the current avatars
     * @param menuId
     */
    public selectUser(user) {
      this.selected = angular.isNumber(user) ? this.users[user] : user;
      this.toggleList();
    }

    /**
     * Show the bottom sheet
     */
    public showContactOptions($event) {
      var user = this.selected;

      return this.$mdBottomSheet.show({
        parent: angular.element(document.getElementById('content')),
        templateUrl: './modules/users/view/contactSheet.html',
        controller: ['$mdBottomSheet', ContactPanelController],
        controllerAs: "cp",
        bindToController: true,
        targetEvent: $event
      }).then(function(clickedItem) {
        clickedItem && this.$log.debug(clickedItem.name + ' clicked!');
      });

      /**
       * Bottom Sheet controller for the Avatar Actions
       */
      function ContactPanelController($mdBottomSheet) {
        this.user = user;
        this.actions = [
          { name: 'Phone', icon: 'phone', icon_url: 'assets/svg/phone.svg' },
          { name: 'Twitter', icon: 'twitter', icon_url: 'assets/svg/twitter.svg' },
          { name: 'Google+', icon: 'google_plus', icon_url: 'assets/svg/google_plus.svg' },
          { name: 'Hangout', icon: 'hangouts', icon_url: 'assets/svg/hangouts.svg' }
        ];
        this.submitContact = function(action) {
          $mdBottomSheet.hide(action);
        };
      }
    }

  }

  angular
    .module('users')
    .controller('UserController', UserController);

}