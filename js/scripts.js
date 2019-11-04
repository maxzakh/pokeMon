var $pokeList = $(".pokeList");

var pokemonRepository = (function () {
    var repository = [];
    var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';


    var $modalContainer = $("#modal-container");

    function showModal(title, text) {
        $modalContainer.html("");

        var $modal = $('.modal-dialog-centered');

        var $closeButtonElement = $('.modal-close');
        $closeButtonElement.on('click', function (event) {
            hideModal();
        })

        var $titleElement = $('<h1>' + title + '</h1>');

        var $contentElement = $('<img>');
        $contentElement.attr("src", text);

        $modal.append($closeButtonElement);
        $modal.append($titleElement);
        $modal.append($contentElement);
        $modalContainer.append($modal);

        $modalContainer.addClass("is-visible");
    };

    function hideModal() {
        $modalContainer.removeClass("is-visible");
    };

    $(window).on("keydown", (e) => {
        if (e.key === "Escape" && $modalContainer.hasClass("is-visible")) {
            hideModal();
        }
    });

    $modalContainer.on("click", (e) => {
        hideModal();
    });

    function add(pokemon) {
        repository.push(pokemon);
    };

    function addListItem(pokemon) {
        var $button = $('<button class="btn pokeDex">' + pokemon.name + '</button>');

        var $listItem = $('<li>' + '</li>');
        $pokeList.append($listItem);
        $pokeList.append($button);

        $button.on("click", function () {
            pokemonRepository.showDetails(pokemon);
        });
    };

    function showDetails(pokemon) {
        pokemonRepository.loadDetails(pokemon).then(function() {
            console.log(pokemon);
            pokemonRepository.showModal(pokemon.name, pokemon.imageUrl);
        });
    };

    function getAll() {
        return repository;
    };

    function loadList() {
        return $.ajax(apiUrl, { dataType: 'json' }).then(function (responseJSON) {
            return responseJSON;
        }).then(function (response) {
            $.each(response.results, function (pokemon, item) {
                var pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon)
            });
        }).catch(function (e) {
            console.error(e);
        })
    };

    function loadDetails(item) {
        var url = item.detailsUrl;
        return $.ajax(url, { dataType: 'json' }).then(function (responseJSON) {
            return responseJSON;
        }).then(function (details) {
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = Object.keys(details.types);
        }).catch(function (e) {
            console.error(e);
        });
    };

    return {
        add: add,
        addListItem: addListItem,
        showDetails: showDetails,
        getAll: getAll,
        loadList: loadList,
        loadDetails: loadDetails,
        showModal: showModal,
        hideModal: hideModal
    };
})();

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});