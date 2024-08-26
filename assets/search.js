import * as params from '@params';

let fuse;
let searchBox = document.getElementById('search');
let resList = document.getElementById('tableListBody');
let allData = [];

window.onload = () => {
    fetch(params.BaseURL + 'index.json')
        .then(res => res.json())
        .then(data => {
            allData = data;
            const options = {
                distance: 100,
                threshold: 0.0,
                ignoreLocation: true,
                keys: [
                    'title',
                    'credentials',
                    'phase',
                    'services',
                    'target',
                    'command'
                ]
            };
            fuse = new Fuse(data, options);
            renderResults(allData);
        });
}

// tags-list toggle function
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tag-link').forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.target.classList.toggle('highlighted-tag');
            const tagName = e.target.getAttribute('data-term');
            const isToggled = e.target.classList.contains('highlighted-tag');
            
            if (isToggled) {
                console.log("[+",tagName,"]");
                filterSearchBox(`[+ ${tagName} ]`, true);
            } else {
                console.log("[-",tagName,"]");
                filterSearchBox(`[+ ${tagName} ]`, false);
            }
            // Trigger the filtering after toggling a tag
            renderResults(allData);
        });
    });
});

// searchbox adds tagName of the tag that's toggled
function filterSearchBox(tagString, add) {
    let searchBoxValue = searchBox.value.trim();

    if (add) {
        // Append the tagString if it's not already there
        if (!searchBoxValue.includes(tagString)) {
            searchBox.value += ` ${tagString}`.trim();
        }
    } else {
        // Remove the tagString from the searchBox
        searchBox.value = searchBoxValue.replace(tagString, '').trim();
    }
    highlightTagsInTable()
}

// highlights the tags in the table-list
function highlightTagsInTable() {
    // Get all tags currently in the search box
    const activeTags = searchBox.value.match(/\[\+ ([^\]]+)]/g) || [];

    // Normalize tag names to lower case (remove the [+ and ] parts)
    const normalizedTags = activeTags.map(tag => tag.replace(/\[\+ |\]/g, '').trim().toLowerCase());

    console.log(allData)

    // Select all .table-tag elements and log them
    const tableTags = document.querySelectorAll('.table-tag');

    // Highlight matching tags in the table-list (case-insensitive)
    tableTags.forEach(tag => {
        const tagName = tag.textContent.trim().toLowerCase();
        //console.log('Selected .table-tag elements:', tagName);
        //console.log('normalizedTags: ', normalizedTags)

        if (normalizedTags.includes(tagName)) {
            tag.classList.add('highlighted-tag');
            console.log('Highlighted:', tagName); // Log the tag name that is highlighted
        } else {
            tag.classList.remove('highlighted-tag');
            //console.log('Unhighlighted:', tag.classList); // Log the tag name that is unhighlighted
        }
    });
}

// search function using a basic character string search
searchBox.addEventListener('input', () => {
    let query = searchBox.value.trim();
    
    console.log("query: ", query)

    if (query === '') {
        renderResults(allData);
    } else {
        let results = fuse.search(query);
        renderResults(results.map(result => result.item));
    }
});

// the tableList is rendered with the search results but NOT the tags filtered
function renderResults(data) {
    let resultSet = '';

    // Get all tags currently in the search box and normalize them
    const activeTags = searchBox.value.match(/\[\+ ([^\]]+)]/g) || [];
    const normalizedTags = activeTags.map(tag => tag.replace(/\[\+ |\]/g, '').trim().toLowerCase());

    // Filter the data based on active tags
    const filteredData = data.filter(item => {
        // Gather all tags from the item and normalize them
        const itemTags = [
            ...item.credentials,
            ...item.phase,
            ...item.services,
            ...item.target
        ].map(tag => tag.toLowerCase());

        // Check if the item contains all active tags
        return normalizedTags.every(tag => itemTags.includes(tag));
    });

    if (filteredData.length !== 0) {
        filteredData.forEach(item => {
            resultSet += `
            <tr>
                <td><code>${item.command}</code></td>
            </tr>
            <tr>
                <td>
                    <ul class="tagsList">
                        <li class="table-tag">${item.credentials.join(', ')}</li>
                        <li class="table-tag">${item.phase.join(', ')}</li>
                        <li class="table-tag">${item.services.join(', ')}</li>
                        <li class="table-tag">${item.target.join(', ')}</li>
                    </ul>
                </td>
            </tr>`;
        });
    } else {
        resultSet = `<tr><td colspan="2">NOTHING FOUND</td></tr>`;
    }

    resList.innerHTML = resultSet;
    highlightTagsInTable(); // Ensure tags in the rendered results are highlighted
}
