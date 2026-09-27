const painting = document.getElementById("painting");
const moodLabel = document.getElementById("moodLabel");
const moodTitle = document.getElementById("moodTitle");
const moodDescription = document.getElementById("moodDescription");

const moods = {
    dreamy: {
        label: "Dreamy",
        title: "A softer way of seeing.",
        description:
            "The same landscape becomes gentle, distant, and almost dreamlike."
    },

    dramatic: {
        label: "Dramatic",
        title: "What if the story felt darker?",
        description:
            "Deeper shadows and stronger contrast turn the same scene into something mysterious."
    },

    calm: {
        label: "Calm",
        title: "Nothing needs to happen.",
        description:
            "Muted colors create a quiet moment where everything feels slower."
    },

    vivid: {
        label: "Vivid",
        title: "See it louder.",
        description:
            "Brighter colors change the energy of the scene without changing its shape."
    }
};

function changeMood(mood) {

    painting.className = "painting " + mood;

    moodLabel.textContent = moods[mood].label;
    moodTitle.textContent = moods[mood].title;
    moodDescription.textContent = moods[mood].description;
}
