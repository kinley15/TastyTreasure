$(document).ready(function () {
    $('.content_for_search').on('input', function () {
        const inputValue = $(this).val().toLowerCase().trim();

        $('.card').each(function () {
            const jobTitleAndAgency = $(this).find('.card__sub-heading').text().toLowerCase();

            // Check if any word in .job-title or .agency is similar to .content_for_search
            if (jobTitleAndAgency.includes(inputValue)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    });
});


$(document).ready(function () {
    function filterJobsByLocation() {
        var checkedLocations = [];
        $(".check:checked").each(function () {
            checkedLocations.push($(this).val());
        });

        $(".card").show();

        if (checkedLocations.length > 0) {
            $(".card").each(function () {
                var location = $(this).find(".dish").text().trim();
                if (!checkedLocations.includes(location)) {
                    $(this).hide();
                }
            });
        }
    }

    $(".check").change(function () {
        filterJobsByLocation();
    });
});