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