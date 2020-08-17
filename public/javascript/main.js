// external js: masonry.pkgd.js, imagesloaded.pkgd.js

// init Masonry
var $grid = $('.grid').masonry({
    itemSelector: '.grid-item',
    percentPosition: true,
    columnWidth: '.grid-sizer'
});
// layout Masonry after each image loads
$grid.imagesLoaded().progress(function () {
    $grid.masonry();
});

// tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

// Modal
$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
})