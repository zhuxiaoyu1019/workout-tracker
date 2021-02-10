$("#add-btn").click(() => {
    $("form").removeClass("hidden");
    $("#update-btn").addClass("hidden");
    $("#submit-btn").removeClass("hidden");
    $("#records").addClass("hidden");
    $("#add-btn-container").addClass("hidden");
    $("#add-form").trigger("reset");
});

$("#close-btn").click(() => {
    $("form").addClass("hidden");
    $("#records").removeClass("hidden");
    $("#add-btn-container").removeClass("hidden");
});

$("#submit-btn").click(addExercises);
$("#update-btn").click(updateExercises);

$(document).on("click", ".delete-btn", deleteExercise);
$(document).on("click", ".edit-btn", switchView);

function addExercises(e) {
    e.preventDefault();
    $.ajax({
        url: "/workouts",
        method: "GET",
    }).then(data => {
        const workoutDateExist = data.map(workout => workout.date === $("#time").text());
        if ($.inArray(true, workoutDateExist) === -1) {
            $.ajax({
                url: "/addWorkout",
                method: "POST",
                data: { date: $("#time").text() }
            }).then(data => {
                console.log(data);
            });
        }
        const exerciseObj = {
            name: $("#exercise").val(),
            type: $("#type option:selected").val(),
            sets: $("#sets").val(),
            reps: $("#reps").val(),
            weights: $("#weight").val(),
            duration: $("#duration").val(),
            distance: $("#distance").val(),
        }
        console.log(exerciseObj);
        $.ajax({
            url: "/addExercise/" + $("#time").text(),
            method: "POST",
            data: exerciseObj
        }).then(() => {
            $("form").addClass("hidden");
            $("#records").removeClass("hidden");
            $("#add-btn-container").removeClass("hidden");
            location.reload();
        });
    });
}

function displayInfo() {
    $.ajax({
        url: "/allWorkouts",
        method: "GET"
    }).then(data => {
        const list = $("#records");
        data.forEach(workout => {
            const workoutContainer = $(`<section class='card my-5' data-id=${workout._id}></section`);
            workoutContainer.append(`<p class='text-xs'>${workout.date}</p>`);
            workout.exercises.forEach(exercise => {
                let icon = "";
                if (exercise.type === "aerobic") {
                    icon = aerobicIcon;
                } else if (exercise.type === "strength") {
                    icon = strengthIcon;
                } else if (exercise.type === "flexibility") {
                    icon = flexibilityIcon;
                } else {
                    icon = balanceIcon;
                }
                const exerciseCard = `
                <section class="card my-5">
                    <section class="flex justify-end">
                        <svg class="w-4 mx-1 cursor-pointer edit-btn" data-id=${exercise._id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                        <svg class="w-4 mx-1 cursor-pointer delete-btn" data-id=${exercise._id} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                    </section>
                    <section class="grid grid-rows-2 grid-cols-4">
                        <section class="flex items-center md:justify-center row-span-2">${icon}</section>
                        <section class="col-span-3 col-start-2 row-start-1">
                            <h4 class="text-2xl sm:text-4xl font-light uppercase">${exercise.name}</h4>
                        </section>
                        <section class="flex items-center col-span-3 col-start-2 row-start-2">
                            <p>${exercise.sets} sets • ${exercise.reps} reps • ${exercise.weights} lbs • ${exercise.duration} min • ${exercise.distance} mi</p>
                        </section>
                    </section>
                </section>`;
                workoutContainer.append(exerciseCard)
            });
            list.append(workoutContainer);
        });
    });
}

function updateExercises(e) {
    e.preventDefault();
    const exerciseObj = {
        name: $("#exercise").val(),
        type: $("#type option:selected").val(),
        sets: $("#sets").val(),
        reps: $("#reps").val(),
        weights: $("#weight").val(),
        duration: $("#duration").val(),
        distance: $("#distance").val(),
    }
    console.log($(this).data("id"));
    $.ajax({
        url: "/edit/" + $(this).data("id"),
        method: "PUT",
        data: exerciseObj
    }).then(() => {
        location.reload();
    });
}

function deleteExercise() {
    $.ajax({
        url: "/delete/" + $(this).data("id"),
        method: "DELETE"
    }).then(() => {
        location.reload();
    });
}

function switchView() {
    $("form").removeClass("hidden");
    $("#update-btn").removeClass("hidden");
    $("#submit-btn").addClass("hidden");
    $("#records").addClass("hidden");
    $("#add-btn-container").addClass("hidden");

    $.ajax({
        url: "/exercise/" + $(this).data("id"),
        method: "GET"
    }).then(data => {
        $("#update-btn").attr("data-id", data._id);
        $("#exercise").val(data.name);
        $("select[name='type']").find(`option[value=${data.type}]`).attr("selected", true);
        $("#sets").val(data.sets);
        $("#reps").val(data.reps);
        $("#weight").val(data.weights);
        $("#duration").val(data.duration);
        $("#distance").val(data.distance);
    });
}

function displayTime() {
    const time = new Date();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    if (date < 10) {
        date = "0" + date;
    }
    $("#time").text(time.getFullYear() + "-" + month + "-" + date);
}

displayTime();
displayInfo();

const aerobicIcon = `<svg class="w-16 sm:w-20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><g><g><path d="M48.074,92.27c-0.124,0-0.248-0.046-0.345-0.139C45.977,90.46,4.814,50.98,4.814,32.549    c0-12.605,10.256-22.861,22.861-22.861c8.713,0,16.639,4.959,20.484,12.724c3.844-7.765,11.769-12.724,20.482-12.724    c12.605,0,22.861,10.256,22.861,22.861c0,2.474-0.755,5.463-2.242,8.885c-0.11,0.253-0.407,0.366-0.658,0.26    c-0.253-0.11-0.369-0.405-0.26-0.658c1.434-3.296,2.16-6.151,2.16-8.486c0-12.055-9.807-21.861-21.861-21.861    c-8.679,0-16.539,5.145-20.024,13.106c-0.16,0.365-0.756,0.365-0.916,0c-3.487-7.962-11.348-13.106-20.026-13.106    c-12.055,0-21.861,9.807-21.861,21.861c0,17.137,38.204,54.6,42.261,58.527c2.741-2.643,21.116-20.559,32.715-37.129    c0.158-0.227,0.47-0.28,0.696-0.122c0.226,0.158,0.281,0.47,0.122,0.696c-12.553,17.934-32.985,37.416-33.189,37.61    C48.322,92.224,48.198,92.27,48.074,92.27z"/></g><g><path d="M62.523,59.097L62.523,59.097c-0.197,0-0.376-0.116-0.456-0.296l-9.257-20.703l-4.399,9.841    c-0.08,0.18-0.259,0.296-0.456,0.296l0,0l-10.949-0.001c-0.276,0-0.5-0.224-0.5-0.5s0.224-0.5,0.5-0.5l0,0l10.625,0.001    l4.724-10.566c0.16-0.359,0.752-0.359,0.912,0l9.257,20.704l6.894-15.413c0.08-0.18,0.259-0.296,0.456-0.296l0,0    c0.197,0,0.376,0.116,0.456,0.296l2.358,5.275h21.654c0.276,0,0.5,0.224,0.5,0.5s-0.224,0.5-0.5,0.5H72.365    c-0.077,0-0.154-0.019-0.224-0.053c-0.104-0.052-0.188-0.139-0.234-0.244l-2.034-4.55l-6.894,15.413    C62.899,58.98,62.721,59.097,62.523,59.097z"/></g></g></svg>`;

const strengthIcon = `<svg class="w-16 sm:w-20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
version="1.1" x="0px" y="0px" viewBox="41.883 170.821 468.234 212.94875000000002"
style="enable-background:new 41.883 170.821 468.234 170.359;" xml:space="preserve">
<g>
    <path
        d="M41.883,289.103h9.343v-33.105c0-2.456,1.99-4.446,4.446-4.446c2.455,0,4.446,1.99,4.446,4.446v33.105h9.343v-66.206   H41.883V289.103z" />
    <polygon
        points="78.352,218.452 78.352,293.549 78.352,311.302 105.93,311.302 105.93,200.695 78.352,200.695  " />
    <path
        d="M409.596,251.444H142.399v-80.623h-9.343v85.177c0,2.455-1.99,4.445-4.446,4.445c-2.455,0-4.446-1.99-4.446-4.445v-85.177   h-9.343v25.428v119.498v25.433h27.578v-80.632h267.197v80.632h9.345v-85.182c0-2.456,1.99-4.446,4.445-4.446   c2.455,0,4.445,1.99,4.445,4.446v85.182h9.349v-25.433V196.249v-25.428h-27.584V251.444z" />
    <path
        d="M500.773,222.898L500.773,222.898v33.1c0,2.455-1.99,4.445-4.445,4.445s-4.445-1.99-4.445-4.445v-33.1h-9.344v66.206   h27.578v-66.206H500.773z" />
    <polygon
        points="446.07,311.302 473.648,311.302 473.648,293.549 473.648,218.452 473.648,200.695 446.07,200.695  " />
</g>
</svg>`;

const flexibilityIcon = `<svg class="w-16 sm:w-20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><path fill="#000000" d="M15.805,36.211c0.178,0.092,0.368,0.137,0.555,0.137c0.437,0,0.858-0.238,1.072-0.652  c0.308-0.592,0.077-1.32-0.516-1.627c-1.285-0.667-2.207-1.799-2.596-3.186c-0.763-2.732,0.838-5.576,3.568-6.34  c1.556-0.436,3.189-0.128,4.482,0.846c0.534,0.401,1.29,0.294,1.69-0.24c0.4-0.531,0.293-1.289-0.239-1.689  c-1.898-1.426-4.298-1.88-6.583-1.242c-4.013,1.123-6.365,5.303-5.244,9.316C12.557,33.542,13.946,35.249,15.805,36.211z   M90.5,74.005h-8.987l-27.487-7.357c-3.846-0.92-7.253-2.658-10.549-4.338c-5.831-2.974-11.34-5.781-18.014-3.343  c-0.626,0.229-0.948,0.922-0.719,1.548c0.229,0.626,0.921,0.949,1.548,0.72c5.688-2.075,10.507,0.381,16.089,3.226  c3.421,1.744,6.958,3.549,11.052,4.527l18.745,5.018H37.113c-5.172,0-10.595-1.811-15.108-4.984V43.532  c0-0.667-0.541-1.207-1.208-1.207c-0.666,0-1.207,0.54-1.207,1.207v23.581c-4.762-4.223-8.034-10.15-8.034-17.122  c0-5.258,1.826-7.925,5.426-7.925c0.666,0,1.207-0.54,1.207-1.206c0-0.667-0.541-1.207-1.207-1.207c-2.929,0-7.84,1.343-7.84,10.338  c0,8.46,4.354,15.522,10.448,20.213v5.447H9.5c-0.666,0-1.207,0.541-1.207,1.207s0.541,1.207,1.207,1.207h12.505v-6.184  c4.633,2.902,9.982,4.537,15.108,4.537h44.241c0.067,0,0.125-0.029,0.19-0.039l8.955,0.039c0.666,0,1.207-0.541,1.207-1.207  C91.707,74.544,91.166,74.005,90.5,74.005z"/></svg>`;

const balanceIcon = `<svg class="w-16 sm:w-20" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><path fill="#000000" d="M47.257,28.338c0.146,0.059,0.296,0.086,0.444,0.086c0.48,0,0.935-0.289,1.123-0.763  c0.245-0.62-0.058-1.321-0.678-1.567c-1.533-0.607-2.698-1.918-3.118-3.51c-0.355-1.342-0.166-2.742,0.532-3.944  c0.699-1.201,1.823-2.058,3.166-2.413c1.574-0.418,3.221-0.083,4.52,0.918c0.529,0.408,1.285,0.312,1.693-0.218  c0.406-0.527,0.309-1.286-0.219-1.692c-1.896-1.465-4.306-1.952-6.612-1.342c-1.966,0.52-3.612,1.775-4.634,3.533  c-1.023,1.76-1.3,3.811-0.78,5.776C43.309,25.53,45.015,27.451,47.257,28.338z M54.76,52.237c0,0.667,0.541,1.207,1.207,1.207  s1.207-0.54,1.207-1.207V32.831h32.152c0.666,0,1.207-0.54,1.207-1.206c0-0.667-0.541-1.207-1.207-1.207H54.76V52.237z   M50.262,53.661l-25.806,6.631v23.66h-9.166c-0.667,0-1.207,0.539-1.207,1.206c0,0.666,0.541,1.206,1.207,1.206h11.581V62.163  l22.854-5.871l36.044,27.66h-6.008c-0.668,0-1.207,0.539-1.207,1.206c0,0.666,0.539,1.206,1.207,1.206h13.119L50.262,53.661z   M41.735,41.828c1.798,2.199,2.127,5.231,2.127,10.41c0,0.667,0.541,1.207,1.208,1.207c0.667,0,1.207-0.54,1.207-1.207  c0-5.75-0.414-9.174-2.673-11.938c-2.595-3.172-2.155-5.732-1.863-7.426c0.081-0.469,0.15-0.873,0.15-1.249v-1.207H8.326  c-0.667,0-1.207,0.54-1.207,1.207c0,0.666,0.541,1.206,1.207,1.206h30.973C38.98,34.764,38.647,38.053,41.735,41.828z"/></svg>`