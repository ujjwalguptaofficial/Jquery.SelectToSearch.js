/*! Jquery.SelectToSearch.js - v1.0 - 24/7/2017
 * https://ujjwalguptaofficial.github.io/MatDialog/
 * Copyright (c) 2017 @Ujjwal Gupta; Licensed MIT */
(function ($) {
    var That;
    $.fn.selectToSearch = function () {
        $(this).focusin(createElements);
    };

    function createElements() {
        var SelectElement = document.createElement('input'),
            DataListInnerHtml = "",
            DataList = document.createElement('datalist');
        That = $(this);
        SelectElement.id = "selectToSearch";
        SelectElement.setAttribute('list', 'selectToSearch_datalist');
        SelectElement.onblur = removeElements;
        //add inline styles
        SelectElement.style.cssText = That.attr('style');
        SelectElement.style.width = That.width();
        SelectElement.style.height = That.height();
        //add class
        var Class = That.attr('class');
        if (Class.length > 0) {
            SelectElement.className = Class;
        }
        DataList.id = "selectToSearch_datalist";
        That.find('option').each(function () {
            DataListInnerHtml += '<option data-value="' + $(this).val() + '"value="' + $(this).text() + '"/>';
        });
        DataList.innerHTML = DataListInnerHtml;
        SelectElement.value = That.find(":selected").text();
        That.after(SelectElement).after(DataList);
        That.hide();
        SelectElement.focus();
    }

    function removeElements() {
        var Value = $(this).val();
        $('#selectToSearch').remove();
        $('#selectToSearch_datalist').remove();
        That.find('option').each(function () {
            if (Value == $(this).text()) {
                That.val($(this).val());
                return false;
            }
        });
        That.show();
    }

}(jQuery));