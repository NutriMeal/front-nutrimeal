function displayRecette() {
  hideBlocb("recette-blocb-display", false);

  // store values of controll bloc
  var inputRecette = document.getElementById("recette-bloca-input").value;
  var inputNbPersonne = document.getElementById("recette-bloca-select").value;
  var uniteMesureBilanPourUnePersonne = "%";

  // compare recette name to know id
  var idRecette = compareNomRecetteToKnowIdRecette(JSONresponse, inputRecette);
  var nomRecette = null;

  ajaxGETgetJSON("recette/" + idRecette, (response) => {
    if (idRecette === null) {
      errorMessage(inputRecette);
    } else {
      elementsDisplayRecette(JSON.parse(response), inputNbPersonne, uniteMesureBilanPourUnePersonne);
    }

    nomRecette = JSON.parse(response).nomRecette;
  });

  //PDF => export pdf, renvoi le code source pdf dans le reponse 
  $("#btnExportPdfRecette").on("click", () => {
    ajaxGETgetPDF("recette/" + idRecette + "/nbPersonnes/" + inputNbPersonne + "/pdf", (response) => {
      $("#holderRecette").html("");
      renderPDF(response, document.getElementById('holderRecette'));
    });

    $("#spinner-cmp").addClass("spinner");
    setTimeout(() => {
      downloadPdf(nomRecette, inputNbPersonne);
      $("#spinner-cmp").removeClass("spinner");
    }, 2200);
  });
}

function elementsDisplayRecette(recetteObj, nbPersonne, uniteMesureBilanPourUnePersonne) {
  // show display bloc
  hideBlocb("recette-blocb-display", false);

  //select existing divs
  var existDivBlocTitleElt = document.getElementsByClassName("blocTitle")[0],
    existDivBlocImgElt = document.getElementsByClassName("blocImg")[0];

  //empty existing Divs
  $(".blocTitle").html("");
  $(".blocImg").html("");

  //add New Title (name recette)
  var titleElt = document.createElement("h4"),
    imgElt = document.createElement("img"),
    divBlocIngredientsElt = document.createElement("div"),
    divBlocInstructionsElt = document.createElement("div"),
    divBlocBilanNutrElt = document.createElement("div");

  titleElt.innerHTML = recetteObj.nomRecette + " pour " + nbPersonne;
  imgElt.src = recetteObj.base64ImageCode;
  imgElt.className = "img-recette";
  divBlocIngredientsElt.innerHTML = "<h5>Ingredients</h5>";
  divBlocInstructionsElt.innerHTML = "<h5>Instructions</h5>";
  divBlocBilanNutrElt.innerHTML = "<h5>Bilan Nutritionnel</h5>";

  //param new Divs with title "Ingredients" and "Instructions"
  existDivBlocImgElt.appendChild(imgElt);
  existDivBlocTitleElt.appendChild(titleElt);
  existDivBlocTitleElt.appendChild(divBlocIngredientsElt);
  existDivBlocTitleElt.appendChild(divBlocInstructionsElt);
  existDivBlocTitleElt.appendChild(divBlocBilanNutrElt);

  //display recette details
  for (var i = 0; i < recetteObj.recetteIngredients.length; i++) {
    var ingredientsElt = document.createElement("p");
    ingredientsElt.innerHTML = "&rarr; " + recetteObj.recetteIngredients[i].ingredients.libelle + ", " + (recetteObj.recetteIngredients[i].quantite * nbPersonne) + " " + recetteObj.recetteIngredients[i].ingredients.uniteMesure;
    divBlocIngredientsElt.appendChild(ingredientsElt);
  }

  //search instructions recette
  for (var j = 0; j < recetteObj.instructions.length; j++) {
    var instructElt = document.createElement("p");
    instructElt.innerHTML = "&rarr; " + recetteObj.instructions[j].libelle;
    divBlocInstructionsElt.appendChild(instructElt);
  }

  var tempsPreparation = document.createElement("p");
  var ferParPortion = document.createElement("p");
  var sodiumParPortion = document.createElement("p");
  var vitamineB12ParPortion = document.createElement("p");
  var vitamineCParPortion = document.createElement("p");
  var vitamineDParPortion = document.createElement("p");

  tempsPreparation.innerHTML = "&rarr; Temps de préparation : " + recetteObj.tempsPreparation + " minutes";
  ferParPortion.innerHTML = "&rarr; Fer par portion : " + recetteObj.ferParPortion + " " + uniteMesureBilanPourUnePersonne;
  sodiumParPortion.innerHTML = "&rarr; Sodium par portion : " + recetteObj.sodiumParPortion + " " + uniteMesureBilanPourUnePersonne;
  vitamineB12ParPortion.innerHTML = "&rarr; Vitamine B12 par portion : " + recetteObj.vitamineB12ParPortion + " " + uniteMesureBilanPourUnePersonne;
  vitamineCParPortion.innerHTML = "&rarr; Vitamine C par portion : " + recetteObj.vitamineCParPortion + " " + uniteMesureBilanPourUnePersonne;
  vitamineDParPortion.innerHTML = "&rarr; Vitamine D par portion : " + recetteObj.vitamineDParPortion + " " + uniteMesureBilanPourUnePersonne;

  divBlocInstructionsElt.appendChild(tempsPreparation);
  divBlocBilanNutrElt.appendChild(ferParPortion);
  divBlocBilanNutrElt.appendChild(sodiumParPortion);
  divBlocBilanNutrElt.appendChild(vitamineB12ParPortion);
  divBlocBilanNutrElt.appendChild(vitamineCParPortion);
  divBlocBilanNutrElt.appendChild(vitamineDParPortion);
}

function downloadPdf(nomRecette, nbPersonnes) {
  //download pdf
  console.log("download pdf lancé");
  var strPersonne = "personne";
  if (nbPersonnes > 1) {
    strPersonne = "personnes";
  }

  var canvas = document.getElementById("my-canvas");
  console.log(canvas);

  var imgData = canvas.toDataURL("image/jpeg", 1.0);
  var pdf = new jsPDF();
  pdf.addImage(imgData, 'JPEG', 0, 0);
  pdf.save("Nutrimeal_" + nomRecette + "_" + nbPersonnes + "_" + strPersonne + ".pdf");
}