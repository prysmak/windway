function leadKanbanReorder(controller, elements) {
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].lead.currentOrder !== i) {
            controller.changeProperty("currentOrder", elements[i].lead, i);
        }
    }
}
function leadKanban() {
    return {
        render: function (element, controller) {
            let kanban = document.createElement("div")
            kanban.classList.add("lead-kanban");

            element.appendChild(kanban);

            element.kanban = kanban;
        },
        update: function (element, controller, list, options) {
            if (element.drake)
                element.drake.destroy();
            element.drake = dragula();

            while (element.kanban.lastElementChild) {
                element.kanban.removeChild(element.kanban.lastElementChild);
            }

            if (options == null || !options.statuses) return;

            for (const status of options.statuses) {
                let statusDiv = document.createElement("div")
                statusDiv.classList.add("lead-kanban-status");
                if (status !== options.statuses[0])
                    statusDiv.classList.add("border-start");

                let statusHeader = document.createElement("div");
                statusHeader.classList.add("lead-kanban-status-header");
                statusDiv.appendChild(statusHeader);

                let statusName = document.createElement("div");
                statusName.classList.add("lead-kanban-status-name");
                statusName.classList.add("h5");
                statusName.innerHTML = status.name;
                statusHeader.appendChild(statusName);

                let statusNew = document.createElement("button");
                statusNew.classList.add("lead-kanban-status-new");
                statusNew.classList.add("btn");
                statusNew.classList.add("btn-light");
                statusNew.innerHTML = "<i class=\"bi bi-plus\"></i>";
                statusHeader.appendChild(statusNew);

                statusNew.addEventListener("click", function() {
                    controller.changeProperty("createLeadStatus", null, status.id);
                });

                let statusBody = document.createElement("div");
                statusBody.classList.add("lead-kanban-status-body");

                for (const lead of list)
                    if (lead.status === status.id.toString()) {
                        let leadCard = document.createElement("div");
                        leadCard.classList.add("lead-kanban-card");
                        leadCard.classList.add("card");
                        if (lead.idColorPriority)
                            leadCard.classList.add("text-bg-" + lead.idColorPriority);

                        leadCard.addEventListener("click", function() {
                            controller.changeObject(lead, true, leadCard);
                        });

                        if (lead.name || lead.nameType) {
                            let leadHeader = document.createElement("h5");
                            leadHeader.classList.add("lead-kanban-card-header");
                            leadHeader.classList.add("card-header");
                            leadHeader.innerHTML = (lead.nameType ? lead.nameType : "") +
                                (lead.name && lead.nameType ? " : " : "") +
                                (lead.name ? lead.name : "");
                            leadCard.appendChild(leadHeader);
                        }

                        let leadContent = document.createElement("ul");
                        leadContent.classList.add("lead-kanban-card-content");
                        leadContent.classList.add("list-group");
                        leadContent.classList.add("list-group-flush");
                        leadCard.appendChild(leadContent);

                        let leadBody = document.createElement("il");
                        leadBody.classList.add("lead-kanban-card-body");
                        leadBody.classList.add("list-group-item");
                        leadContent.appendChild(leadBody);

                        let nameClient = document.createElement("h6");
                        nameClient.classList.add("lead-kanban-card-client");
                        nameClient.classList.add("card-title");
                        nameClient.classList.add("text-body-secondary");
                        nameClient.innerHTML = lead.nameClient;
                        leadBody.appendChild(nameClient);

                        let items = document.createElement("div");
                        items.classList.add("lead-kanban-card-items");
                        items.classList.add("card-text");
                        items.innerHTML = lead.htmlItems;
                        leadBody.appendChild(items);

                        let activities = document.createElement("div");
                        activities.classList.add("lead-kanban-card-activities");
                        activities.classList.add("card-text");
                        activities.innerHTML = lead.htmlActivities;
                        leadBody.appendChild(activities);


//                        let activities = document.createElement("table");
//                        activities.classList.add("lead-kanban-card-activities");
//                        activities.classList.add("list-group-item");
//                        items.innerHTML = lead.htmlActivities;
//                        leadContent.appendChild(activities);

//                        let leadRevenue = document.createElement("div");
//                        leadRevenue.classList.add("lead-kanban-card-revenue");
//                        leadRevenue.classList.add("card-text");
//                        leadRevenue.innerHTML = lead.expectedRevenue;
//                        leadBody.appendChild(leadRevenue);

//                        if (lead.jsonItems) {
//                            let leadItems = document.createElement("li");
//                            leadItems.classList.add("lead-kanban-card-items");
//                            leadItems.classList.add("list-group-item");
//                            for (const item of lead.jsonItems) {
//                                let leadItem = document.createElement("span");
//                                leadItem.classList.add("lead-kanban-card-item");
//                                leadItem.classList.add("badge");
//                                leadItem.classList.add("rounded-pill");
//                                //leadTag.classList.add("text-bg-" + (tag.idColor ? tag.idColor : "secondary"));
//                                leadItem.innerHTML = item.name;
//                                leadItems.appendChild(leadItem);
//                            }
//                            leadContent.appendChild(leadItems);
//                        }

                        if (lead.tags) {
                            let leadTags = document.createElement("li");
                            leadTags.classList.add("lead-kanban-card-tags");
                            leadTags.classList.add("list-group-item");
                            for (const tag of lead.tags) {
                                let leadTag = document.createElement("span");
                                leadTag.classList.add("lead-kanban-card-tag");
                                leadTag.classList.add("badge");
                                leadTag.classList.add("rounded-pill");
                                leadTag.classList.add("text-bg-" + (tag.idColor ? tag.idColor : "secondary"));
                                leadTag.innerHTML = tag.name;
                                leadTags.appendChild(leadTag);
                            }
                            leadContent.appendChild(leadTags);
                        }

                        let leadSalesPerson = document.createElement("li");
                        leadSalesPerson.classList.add("lead-kanban-card-sales-person");
                        leadSalesPerson.classList.add("list-group-item");
                        leadSalesPerson.innerHTML = lead.nameSalesPerson;
                        leadContent.appendChild(leadSalesPerson);

//                        if (lead.expectedClosing) {
//                            let leadExpectedClosing = document.createElement("div");
//                            leadExpectedClosing.classList.add("lead-kanban-card-expected-closing");
//                            leadExpectedClosing.classList.add("card-footer");
//                            leadExpectedClosing.innerHTML = moment(lead.expectedClosing).toISOString(true).substring(0, 10);
//                            leadCard.appendChild(leadExpectedClosing);
//                        }

                        leadCard.lead = lead;
                        statusBody.appendChild(leadCard);
                    }

                statusDiv.appendChild(statusBody);

                statusBody.status = status;
                element.drake.containers.push(statusBody);

                element.kanban.appendChild(statusDiv);
            }

            element.drake.on("drop", function(el, target, source, sibling) {
                if (el.lead.status !== target.status.id.toString())
                    controller.changeProperty("status", el.lead, target.status.id);
                leadKanbanReorder(controller, target.children);
            });

        },
        clear: function (element) {
            if (element.drake)
                element.drake.destroy();
        }
    }
}
