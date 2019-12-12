var $pokeList = $(".pokeList");

var normal = "#A8A77A",
    fire = "#EE8130",
    water = "#6390F0",
    electric = "#F7D02C",
    grass = "#7AC74C",
    ice = "#96D9D6",
    fighting = "#C22E28",
    poison = "#A33EA1",
    ground = "#E2BF65",
    flying = "#A98FF3",
    psychic = "#F95587",
    bug = "#A6B91A",
    rock = "#B6A136",
    ghost = "#735797",
    dragon = "#6F35FC";

var pokemonRepository = (function () {
    var repository = [];
    var apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";


    var $modalContainer = $("#modal-container");

    function capitalizeWord(word) {
        return word[0].toUpperCase() + word.slice(1);
    }

    function capArray(arr) {

        for (let i = 0; i < arr.length; i++) {
            arr[i] = arr[i][0].toUpperCase() + arr[i].slice(1);
        }
    }

    function showModal(title, text, types) {

        var $modal = $(".modal-body");

        var $closeButtonElement = $(".modal-close");
        $closeButtonElement.on("click", function () {
            hideModal();
        })

        var pokeName = capitalizeWord(title);
        var $modalTitle = $(".modal-title");
        if ($modalTitle.length) {
            $modalTitle.empty();
            $modal.empty();
        }
        $modalTitle.append(pokeName);

        var $contentElement = $("<img>").attr("src", text);
        $modal.append($contentElement);

        capArray(types);
        
        var pokeTypes = types.join(", ");

        console.log(types);

        var color = pokeTypes.toLowerCase();
        console.log(types.length);

        if (types.length == 1) {
            console.log(color);
            // $modal.css("background-color", psychic);
        }


        var $types = $(".pokeTypes");
        if ($types.length) {
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
        pokemonRepository.loadDetails(pokemon).then(function () {
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
            item.types = details.types.map(function (pokemon) {
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

$gen1.on("click", function () {
    if (($(".pokeList").contents().length == 0)) {
        pokemonRepository.loadList().then(function () {
            pokemonRepository.getAll().forEach(function (pokemon) {
                pokemonRepository.addListItem(pokemon);
            });
        });
    }
});