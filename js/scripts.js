var $pokeList = $(".pokeList");

var pokemonRepository = (function () {
    var repository = [];
    var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";


    var $modalContainer = $("#modal-container");

    function capitalizeWord(word) {
        return word[0].toUpperCase() + word.slice(1);
    }

    // var capitalizeArray = (element) => element.map(capitalizeWord).join("");

    function showModal(title, text, types) {

        var $modal = $(".modal-body");
        $modal.css("background-color", "blue");

        var $closeButtonElement = $(".modal-close");
        $closeButtonElement.on("click", function () {
            hideModal();
        })


        var pokeName = capitalizeWord(title);
        var $modalTitle = $(".modal-title");
        if($modalTitle.length) {
            $modalTitle.empty();
            $modal.empty();
        }
        $modalTitle.append(pokeName);

        var $contentElement = $("<img>").attr("src", text);
        $modal.append($contentElement);

        var pokeTypes = types.join(", ");
        console.log(pokeTypes);
        types.map(function(item) {
            return item.capitalizeWord();
        });
        var $types = $(".pokeTypes");
        if($types.length) {
            $types.empty();
        }
        $types.append(pokeTypes);

        $modalContainer.modal("show");
    }

    function hideModal() {
        $modalContainer.modal("hide");
    }

    $(window).on("keydown", (e) => {
        if (e.key === "Escape" && $modalContainer.hasClass("is-visible")) {
            hideModal();
        }
    });

    $modalContainer.on("click", () => {
        hideModal();
    });

    function add(pokemon) {
        repository.push(pokemon);
    }

    function addListItem(pokemon) {
        var name = capitalizeWord(pokemon.name);
        var $button = $("<button class=\"btn pokeDex\">" + name + "</button>");

        var $listItem = $("<li>" + "</li>");
        $pokeList.append($listItem);
        $listItem.append($button);

        $button.on("click", function () {
            pokemonRepository.showDetails(pokemon);
        });
    }

    function showDetails(pokemon) {
        pokemonRepository.loadDetails(pokemon).then(function() {
            pokemonRepository.showModal(pokemon.name, pokemon.imageUrl, pokemon.types);
        });
    }

    function getAll() {
        return repository;
    }

    function loadList() {
        return $.ajax(apiUrl, { dataType: "json" }).then(function (responseJSON) {
            return responseJSON;
        }).then(function (response) {
            $.each(response.results, function (pokemon, item) {
                pokemon = {
                    name: item.name,
                    detailsUrl: item.url
                };
                add(pokemon)
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    function loadDetails(item) {
        var url = item.detailsUrl;
        return $.ajax(url, { dataType: "json" }).then(function (responseJSON) {
            return responseJSON;
        }).then(function (details) {
            item.imageUrl = details.sprites.front_default;
            item.height = details.height;
            item.types = details.types.map(function(pokemon) {
                return pokemon.type.name;
            });
        }).catch(function (e) {
            console.error(e);
        });
    }

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

let $gen1 = $(".gen1")

$gen1.on("click", function() {
    if (($(".pokeList").contents().length == 0)) {
        pokemonRepository.loadList().then(function () {
            pokemonRepository.getAll().forEach(function (pokemon) {
                pokemonRepository.addListItem(pokemon);
            });
        });
    }
});