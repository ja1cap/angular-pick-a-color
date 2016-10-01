/**
 * pick-a-color directive for AngularJS
 * Written by Chris Jackson
 * MIT License
 *
 * See https://github.com/lauren/pick-a-color for the excellent color picker
 */
angular.module('pickAColor', [])
    .provider("pickAColor", function() {
        this.options = {};

        this.$get = function () {
            var localOptions = this.options;
            return {
                getOptions: function () {
                    return localOptions;
                }
            };
        };

        this.setOptions = function (options) {
            this.options = options;
        };
    })

    .directive('pickAColor', function ($parse, pickAColor) {
        return {
            restrict: 'E',
            compile: function (element, attrs) {
                var model = $parse(attrs.ngModel);

                // Compile the HTML template
                var html = "<input type='text' id='" + attrs.id + "'" +
                    "name='" + attrs.name + "'" +
                    "' class='disabled pick-a-color form-control'>" +
                    "</input>";

                var newElem = $(html);
                element.replaceWith(newElem);

                return function (scope, element, attrs, controller) {
                    // Process options
                    var options = pickAColor.getOptions();
                    if (attrs.inlineDropdown !== undefined) {
                        options.inlineDropdown = JSON.parse(attrs.inlineDropdown);
                    }
                    if (attrs.showSpectrum !== undefined) {
                        options.showSpectrum = JSON.parse(attrs.showSpectrum);
                    }
                    if (attrs.showSavedColors !== undefined) {
                        options.showSavedColors = JSON.parse(attrs.showSavedColors);
                    }
                    if (attrs.saveColorsPerElement !== undefined) {
                        options.saveColorsPerElement = JSON.parse(attrs.saveColorsPerElement);
                    }
                    if (attrs.fadeMenuToggle !== undefined) {
                        options.fadeMenuToggle = JSON.parse(attrs.fadeMenuToggle);
                    }
                    if (attrs.showAdvanced !== undefined) {
                        options.showAdvanced = JSON.parse(attrs.showAdvanced);
                    }
                    if (attrs.showBasicColors !== undefined) {
                        options.showBasicColors = JSON.parse(attrs.showBasicColors);
                    }
                    if (attrs.showHexInput !== undefined) {
                        options.showHexInput = JSON.parse(attrs.showHexInput);
                    }
                    if (attrs.allowBlank !== undefined) {
                        options.allowBlank = JSON.parse(attrs.allowBlank);
                    }

                    scope.$watch(model, function(value) {
                        element.val(model(scope));
                        element.focus();
                        element.blur();
                    });

                    // Set the value before we initialise the picker
                    element.val(model(scope));

                    // Create the 'pick-a-color control
                    element.pickAColor(
                        options
                    );

                    // Handle changes to the value
                    element.on("change", function () {
                        var value = $(this).val();

                        // This probably shouldn't be needed, but currently pick-a-color doesn't close on enter
                        // so we end up with an unvalidated value
                        value = tinycolor(value).toHexString();
                        scope.$apply(function (scope) {
                            // Change bound variable
                            model.assign(scope, value);
                        });
                    });
                };
            }
        };
    });
