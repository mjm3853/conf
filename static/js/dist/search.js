var idx, events;

function initIndex() {

    var url = "js/dist/lunr.js";

    $.getJSON(url, function (json) {
        events = json;
        idx = lunr(function () {
            this.ref('uri')
            this.field('uri')
            this.field('title', {
                boost: 10
            })
            this.field('tags', {
                boost: 5
            })
            this.field('content', {
                boost: 2
            })

            json.forEach(function (doc) {
                this.add(doc)
            }, this)

        })
    })
}

function initSearch() {
    $results = $("#results");
    $("#search").keyup(function () {
        $results.empty();

        var query = $(this).val();
        if (query.length < 2) {
            return;
        }

        var results = runSearch(query)

        renderResults(results);
    })
}

function runSearch(query) {
    var searchResults = [];
    idx.search(query).map(function (result) {
        var uri = result.ref;
        var details = events.find(function (event) {
            return event.uri === uri
        })
        result.title = details.title
        searchResults.push(result);
    });
    return searchResults;
}

function renderResults(results) {
    if (!results.length) {
        return;
    }

    results.slice(0, 10).forEach(function (result) {

        var $result = $("<li>");
        $result.append($("<a>", {
            href: result.ref,
            text: result.title
        }));
        $results.append($result)
    });
}

initIndex()

$(document).ready(function () {
    initSearch();
})