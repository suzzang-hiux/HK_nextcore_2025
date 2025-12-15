const creatorOptions = {
  showLogicTab: true
  ,showJSONEditorTab : false // JSON 편집기 표시 여부
  ,isAutoSave: true
  ,questionTypes: ["boolean", "checkbox", "comment", "dropdown", "tagbox", "html", "image", "imagepicker", "matrix", "matrixdropdown", "matrixdynamic", "multipletext", "panel", "paneldynamic", "radiogroup", "rating", "ranking", "text"]
};
var creator = new SurveyCreator.SurveyCreator(creatorOptions);
creator.haveCommercialLicense = true;
creator.locale = "ko";
creator.render("creatorElement");

var defaultJson = {
  locale: "ko",
  "pages": [
    {
      "name": "1페이지",
      "elements": ""
    }
  ],
  "showQuestionNumbers": "off"
};

creator.text = window.localStorage.getItem("survey-json") || JSON.stringify(defaultJson);