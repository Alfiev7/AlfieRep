'use strict'

var gCinema
var gElSelectedSeat = null


function onInit() {
    gCinema = createCinema()
    renderCinema()

    const elCloseBtn = document.querySelector('.popup .close-btn');
    elCloseBtn.addEventListener('click', closePopup);

    
}

function createCinema() {
    const cinema = []
    for (var i = 0; i < 6; i++) {
        cinema[i] = []
        for (var j = 0; j < 10; j++) {
            const cell = {
                isSeat: isSeatLocation(i,j)
            }
            if (cell.isSeat) {
                cell.price = 5 + i
                cell.isBooked = false
            }

            cinema[i][j] = cell
        }
    }

    // cinema[2][2].isBooked = true
    return cinema
}


function isSeatLocation(row, col) {
    const layout = [
        [true, true, false, true, true, true, true, false, true, true],
        [true, true, false, true, true, true, true, false, true, true],
        [true, true, false, true, true, true, true, false, true, true],
        [false, false, false, false, false, false, false, false, false],
        [true, true, false, true, true, true, true, false, true, true],
        [true, true, false, true, true, true, true, false, true, true],
        [true, true, false, true, true, true, true, false, true, true]
    ];

    return layout[row][col];
}



function renderCinema() {
    var strHTML = ''
    for (var i = 0; i < gCinema.length; i++) {
        strHTML += `<tr class="cinema-row" >\n`
        for (var j = 0; j < gCinema[0].length; j++) {
            const cell = gCinema[i][j]
            // For cell of type SEAT add seat class:
            var className = (cell.isSeat) ? 'seat' : ''
            if (cell.isBooked) {
                className += ' booked'
            }
            // Add a seat title:
            const title = `Seat: ${i + 1}, ${j + 1}`

            // TODO: for cell that is booked add booked class

            strHTML += `\t<td data-i="${i}" data-j="${j}" title="${title}" class="cell ${className}" 
                            onclick="onCellClicked(this, ${i}, ${j})" >
                         </td>\n`
        }
        strHTML += `</tr>\n`
    }
    // console.log(strHTML)

    const elSeats = document.querySelector('.cinema-seats')
    elSeats.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    const cell = gCinema[i][j]
    // ignore none seats and booked
    if (!cell.isSeat || cell.isBooked) return

    console.log('Cell clicked: ', elCell, i, j)

    // Support selecting a seat
    elCell.classList.add('selected')

    if (gElSelectedSeat) {
        gElSelectedSeat.classList.remove('selected')
    }

    // Only a single seat should be selected
    gElSelectedSeat = (gElSelectedSeat !== elCell) ? elCell : null

    // When seat is selected a popup is shown
    if (gElSelectedSeat) {
        gElSelectedSeat.i = i; 
        gElSelectedSeat.j = j; 
        showSeatDetails({i, j});
    } else {
        hideSeatDetails();
        gElSelectedSeat = null;
    }
}

function showSeatDetails(pos) {
    const elPopup = document.querySelector('.popup')
    const seat = gCinema[pos.i][pos.j]

    elPopup.querySelector('h2 span').innerText = `${pos.i + 1}-${pos.j + 1}`
    elPopup.querySelector('h3 span').innerText = `${seat.price}`
    elPopup.querySelector('h4 span').innerText = countAvailableSeatsAround(gCinema, pos.i, pos.j)
    const elBtn = elPopup.querySelector('.book-button')

    // highlightAvailableSeatsAround(gCinema, pos.i, pos.j)
    elBtn.dataset.i = pos.i
    elBtn.dataset.j = pos.j
    elPopup.hidden = false
}

function hideSeatDetails() {
    document.querySelector('.popup').hidden = true
}

function onBookSeat(elBtn) {
    console.log('onBookSeat called with: ', elBtn);
    const i = +elBtn.dataset.i
    const j = +elBtn.dataset.j

        // Log the seat position
        console.log('Seat position: ', i, j);

        
    // Check and log the current status of the seat
    console.log('Before booking: ', gCinema[i][j]);

    gCinema[i][j].isBooked = true

    // Check and log the status of the seat after booking
    console.log('After booking: ', gCinema[i][j]);

    renderCinema()

    hideSeatDetails()
}



function countAvailableSeatsAround(board, rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isSeat && !currCell.isBooked) count++
        }
    }
    return count
}

function closePopup() {
    const elPopup = document.querySelector('.popup');
    elPopup.hidden = true;
    gElSelectedSeat.classList.remove('selected')
    
    gElSelectedSeat = null;
}



function highlightAvailableSeatsAround(board, rowIdx, colIdx) {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= board.length) continue;
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (i === rowIdx && j === colIdx) continue;
                if (j < 0 || j >= board[0].length) continue;  
                var elSeat = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                if (elSeat.classList.contains('seat') && !elSeat.classList.contains('booked')) {
                    elSeat.classList.add('highlight');
                }
            }
                }
                
                setTimeout(() => {
                    for (let i = rowIdx - 1; i <= rowIdx + 1; i++) {
                        if (i < 0 || i >= board.length) continue;
                        for (let j = colIdx - 1; j <= colIdx + 1; j++) {
                            if (i === rowIdx && j === colIdx) continue;
                            if (j < 0 || j >= board[0].length) continue;
                            const elSeat = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                            if (elSeat.classList.contains('highlight')) {
                                elSeat.classList.remove('highlight');
                            }
                        }
                    }
                }, 2500);
            }