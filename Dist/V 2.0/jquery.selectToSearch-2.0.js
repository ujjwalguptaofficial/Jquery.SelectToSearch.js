/*! Jquery.SelectToSearch.js - v2.0 - 26/7/2017
 * https://github.com/ujjwalguptaofficial/Jquery.SelectToSearch.js
 * Copyright (c) 2017 @Ujjwal Gupta; Licensed MIT */
(function ($) {
    var Element,
        SelectedIndex = -1,
        SelectToSearchList = [],
        List,
        FilteredSearchList = [],
        FocusinContainer = false;
    $.fn.selectToSearch = function (isAdv) {
        if (isAdv) {
            $(this).focusin(function () {
                createElementsForAdvSetup(this);
            });
        } else {
            $(this).focusin(createElements);
        }
        return this;
    };

    //Advanced setup block
    function removeElementsForAdvSetup() {
        Element.val(FilteredSearchList[SelectedIndex].Value);
        makeEveryThingNull();
    }

    function makeEveryThingNull(e) {
        if (Element != null) {
            Element.show();
            List = null;
            SelectedIndex = -1;
            FilteredSearchList = [];
            SelectToSearchList = [];
            FocusinContainer = false;
            Element = null;
            $('.selectToSearch_container').remove();
        }
    }

    function hoverOverList(e) {
        var Key = e.keyCode;
        if (Key == 40 || Key == 38) {
            e.preventDefault();
            var Filtered;
            List.filter('.activeList-SelectToSearch').removeClass('activeList-SelectToSearch');
            if (Key == 40) {
                SelectedIndex = ++SelectedIndex == List.length ? 0 : SelectedIndex;
            } else if (Key == 38) {
                SelectedIndex = --SelectedIndex < 0 ? List.length - 1 : SelectedIndex;
            }
            Filtered = List.eq(SelectedIndex);
            Filtered.closest('ul').scrollTop(SelectedIndex * Filtered.outerHeight());
            Filtered.addClass('activeList-SelectToSearch');
        } else if (Key == 13) {
            removeElementsForAdvSetup();
        }
    }

    function filterText(e) {
        var Key = e.keyCode;
        if (!(Key == 40 || Key == 38 || Key == 13)) {
            var TextValue = $(this).val().toLowerCase(),
                ListContainer = $('#selectToSearch_list');
            ListInnerHtml = "";
            FilteredSearchList = [];
            SelectToSearchList.forEach(function (item) {
                if (item.CmpText.indexOf(TextValue) >= 0) {
                    FilteredSearchList.push({
                        Value: item.Value
                    })
                    ListInnerHtml += '<li>' + item.Text + '</li>';
                }
            });
            ListContainer.html("").html(ListInnerHtml);
            List = ListContainer.find('li');
            SelectedIndex = -1;
        }

    }

    function htmlEncode(input) {
        return String(input).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function createElementsForAdvSetup(element) {
        if (List == null) {
            Element = $(element);
            SelectedIndex = Element.find(":selected").index();
            var TextBox = document.createElement('input'),
                ListInnerHtml = "",
                DropDownWidth = Element.width(),
                ListContainer = document.createElement('ul'),
                Container = document.createElement('div');
            //configure container
            Container.className = 'selectToSearch_container'
            Container.style.width = DropDownWidth + 'px';
            ListContainer.onmouseenter = function () {
                FocusinContainer = true;
            }

            ListContainer.onmouseleave = function () {
                FocusinContainer = false;
            }

            //configure textbox
            TextBox.type = 'text';
            TextBox.value = Element.find(":selected").text();
            TextBox.id = "txtSelectToSearch";
            TextBox.onkeyup = filterText;
            TextBox.onkeydown = hoverOverList;
            TextBox.onblur = function (e) {
                if (!FocusinContainer) {
                    makeEveryThingNull();
                }
            }
            TextBox.style.cssText = Element.attr('style');
            TextBox.style.height = Element.height();
            var Class = Element.attr('class');
            if (Class.length > 0) {
                TextBox.className = Class;
            }
            //configure list
            ListContainer.style.cssText = "height:0px;border:" + Element.css('border') + ";";
            ListContainer.id = "selectToSearch_list";

            SelectToSearchList, FilteredSearchList = [];
            var OptionElement, OptionValue, TextValue, EncodedTextValue;

            Element.find('option').each(function () {
                OptionElement = $(this);
                TextValue = OptionElement.text();
                OptionValue = OptionElement.val();
                EncodedTextValue = htmlEncode(TextValue);
                SelectToSearchList.push({
                    Text: EncodedTextValue,
                    Value: OptionValue,
                    CmpText: TextValue.toLowerCase()
                });
                FilteredSearchList.push({
                    Value: OptionValue
                })
                ListInnerHtml += '<li>' + EncodedTextValue + '</li>';
            });
            ListContainer.innerHTML = ListInnerHtml;
            Container.appendChild(TextBox);
            Container.appendChild(ListContainer);
            Element.after(Container);
            List = $(ListContainer).find('li');
            var Filtered = $('#selectToSearch_list li').eq(SelectedIndex);
            Filtered.closest('ul').scrollTop(SelectedIndex * Filtered.outerHeight());
            Filtered.addClass('activeList-SelectToSearch');
            Element.hide();
            TextBox.focus();
            $(ListContainer).on('mousedown', 'li', function (e) {
                SelectedIndex = $(this).index();
                removeElementsForAdvSetup();
                e.preventDefault();
            }).on('mouseover', 'li', function () {
                SelectedIndex = $(this).index();
                List.filter('.activeList-SelectToSearch').removeClass('activeList-SelectToSearch');
                $(this).addClass('activeList-SelectToSearch');
            }).height('auto');
        } else {
            setTimeout(function () {
                createElementsForAdvSetup(element);
            }, 100);
        }
    }

    //Browser mode
    function createElements() {
        var SelectElement = document.createElement('input'),
            DataListInnerHtml = "",
            DataList = document.createElement('datalist');
        Element = $(this);
        SelectElement.id = "selectToSearch";
        SelectElement.setAttribute('list', 'selectToSearch_datalist');
        SelectElement.onblur = removeElements;
        //add inline styles
        SelectElement.style.cssText = Element.attr('style');
        SelectElement.style.width = Element.width();
        SelectElement.style.height = Element.height();
        //add class
        var Class = Element.attr('class');
        if (Class.length > 0) {
            SelectElement.className = Class;
        }
        DataList.id = "selectToSearch_datalist";
        Element.find('option').each(function () {
            DataListInnerHtml += '<option data-value="' + $(this).val() + '"value="' + $(this).text() + '"/>';
        });
        DataList.innerHTML = DataListInnerHtml;
        SelectElement.value = Element.find(":selected").text();
        Element.after(SelectElement).after(DataList);
        Element.hide();
        SelectElement.focus();
    }

    function removeElements() {
        var Value = $(this).val();
        $('#selectToSearch').remove();
        $('#selectToSearch_datalist').remove();
        Element.find('option').each(function () {
            if (Value == $(this).text()) {
                Element.val($(this).val());
                return false;
            }
        });
        Element.show();
    }


}(jQuery));