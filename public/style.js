let currentPage = 1;
let currentname = '';
let currentmobile = '';
let currentgroups = '';
let itemsPerPage = 3;

function getGroupName() {
  const searchValue = $('#search').val();
  
  $.ajax({
    url: '/contact/groupName',
    type: 'get',
    success: function (data) {
    
      
      const dropdown = $('#dropdown');
      dropdown.empty();
      dropdown.append(`<option value="-" placeholder="-">No Group</option>`);
      const options = data.data.map(g => g.name);
         
                options.forEach(option => {
                    dropdown.append(`<option value="${option}">${option}</option>`);
                });
    
                const dropsearch = $('#group');
                dropsearch.empty();
                dropsearch.append(`<option value="">Select group </option><option value="-"> No Group </option>`);
                const optionSearch = data.data.map(g => g.name);
                   
                optionSearch.forEach(option => {
                  dropsearch.append(`<option value="${option}">${option}</option>`);
                          });
      
    },
    error: function (error) {
      console.error('Error fetching items:', error);
    }
  });
}




function getItems(page,name,mobile,groups,perPage) {
  const searchValue = $('#search').val();
  
  $.ajax({
    url: '/contact/details',
    type: 'post',
    data: {
      page: page,name,mobile,groups,perPage
    },
    success: function (data) {
     $('#searching').prop('disabled', false);
     $('#Itembtn').prop('disabled', false);
  
      currentPage = data.current;
      displayItems(data.data, data.group);
      displayPagination(data.current, data.pages);
    },
    error: function (error) {
      console.error('Error fetching items:', error);
    }
  });
}    

function formatStartingDate(startingDate) {
  const currentDate = new Date();
  const startDate = new Date(startingDate);

  const timeDifference = currentDate - startDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  if (seconds < 60) {
    return `${seconds} second${seconds === 1 ? '' : 's'} ago`;
  } else if (minutes < 60) { return `${minutes} minute${minutes === 1 ? '' : 's'} ago`; }
  else if (hours < 24) { return `${hours} hour${hours === 1 ? '' : 's'} ago`; }
  else if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  } else { return `${weeks} week${weeks === 1 ? '' : 's'} ago`; }
}


function displayItems(contact,group) {
  const itemList = $('#table');

  // Clear existing content before updating
  itemList.empty();


  // Check if the 'contact' array has elements
  
    // Append the opening tag of the table
    itemList.append(`
      <div class="table-responsive" >
      <table class="table table-striped table-sm">
        <thead>
          <tr>
            <th scope="col">First Name</th>
            <th scope="col">Mobile No</th>
            <th scope="col">Group</th>
            <th scope="col">Created At</th>
            <th scope="col" class="text-end">Action</th>
          </tr>
        </thead>
        <tbody>
    `);

    if (contact.length > 0) {
    contact.forEach(element => {
     
      itemList.append(`
      
      <div class="table-responsive">
          <table class="table table-striped table-sm">
              <thead>
                  <tr class="col align-middle">
                      <th scope="col" class="align-middle" "><div  style="margin-right: 6.5rem;">${element.name}</div></th>
                      <th scope="col" class="align-middle">
                          <div style="margin-right: 3rem;">${element.mobileNo}</div>
                      </th>
                      <th scope="col" class="align-middle">
                      <div  style="margin-right: 4rem;">${element.group}</div>
                  </th>
                     
                      <th scope="col" class="align-center">${formatStartingDate(element.startingDate)}</th>
                      <th class="text-end align-middle">
                          <div class="d-flex flex-row justify-content-end gap-2">
                              <!-- Your action buttons here -->
                            
                             <button type="button"  class="btn btn-warning btn-sm edit" data-id="${element._id}">
                           
                             <i class="bi bi-pencil"></i></td> 
                                  </button>
                          
                                  <form class="position-relative deleteForm" onsubmit="return confirmDelete();">
                                  <input type="hidden" class="deleteId" name="id" value="${element._id}">
                                  <button type="button" class="btn btn-danger btn-small">
                                      <i class="bi bi-person-x"></i>
                                  </button>
                              </form>
                          </div>
                      </th>
                  </tr>
              </thead>
          </table>
      </div>
      
          
      `);
    });

    // Append the closing tag of the table
    itemList.append(`
        </tbody>
      </table>
      </div>
    `);
  } else {
    // Show a message if no records are available
    itemList.append(`
      <div class="row mt-4">
        <div class="col text-center">
         
          <h4>No records have been created.</h4>
         
        </div>
      </div>
        
    `);
  }
 
}



function displayPagination(currentPage, totalPages, isSearch) {
  const paginationContainer = $('#pagination');

  // Clear existing pagination before updating
  paginationContainer.empty();

  // Add pagination components if there are more than one page
  if (totalPages > 1) {
    paginationContainer.append(`
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content">
          <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="getItems(${currentPage - 1}, '${currentname}', '${currentmobile}', '${currentgroups}', '${itemsPerPage}')" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    `);

    for (let i = 1; i <= totalPages; i++) {
      paginationContainer.find('ul').append(`
        <li class="page-item ${currentPage === i ? 'active' : ''}">
          <a class="page-link" href="#" onclick="return getItems(${i}, '${currentname}', '${currentmobile}', '${currentgroups}', '${itemsPerPage}')">${i}</a>
        </li>
      `);
    }

    paginationContainer.append(`
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content">
          <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="return getItems(${currentPage + 1}, '${currentname}', '${currentmobile}', '${currentgroups}', '${itemsPerPage}')" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    `);
  }
}





function confirmDelete() {
  return confirm("Are you sure you want to delete this record?");
}
const search = () => {
  $('#searchform').on('submit', (e) => {
    e.preventDefault();

    let name = $('#searchname').val();
    let mobile = $('#mobile').val();
    let groups = $('#group').val();
  

    $('#searching').prop('disabled', true);
  
   
    currentname = name;
    currentmobile = mobile;
    currentgroups = groups;
     getItems(1,name, mobile, groups,itemsPerPage);
     currentPage = 1;
  });
}



const pageform = () => {
  $('#itemspage').on('submit', (e) => {
    e.preventDefault();

    let perPage = $('#perpage').val();
    itemsPerPage = perPage;

   
    $('#Itembtn').prop('disabled', true);
       
    getItems(1,currentname,currentmobile,currentgroups, perPage);
    currentPage = 1;
  });
}
const editForm = () => {
  var id = $(this).data('id');
  // Move this outside the click event handler
  function displayEditForm(id) {
    $('#dynamic_modal_title').text('Edit Data');
    $('#action').val('Edit');
    // $('#id').val(id);
        $('#contactid').val(id);
    $('#action_button').text('Edit');
    $('#action_modal').modal('show');
  
    $.ajax({
      url: 'dashboard/userdeatil',
      method: 'POST',
      data: { id: id },
      success: function (data) {
        $('#name').val(data.data.name);
        $('#mobileNo').val(data.data.mobileNo);
        $('#contactid').val(id);
        $('#dropdown').val(data.data.group);
      },
    });
  }

  // Display the edit form when the 'Edit' button is clicked
  $(document).on('click', '.edit', function () {
    var id = $(this).data('id');
    displayEditForm(id);
  });
  // Handle form submission separately
};




const addData = () => {
  $('#sample_form').on('submit', (e) => {
    e.preventDefault();

   
        let name = $('#name').val();
        let mobileNo = $('#mobileNo').val();
        let group = $('#dropdown').val();
        let id = $('#contactid').val();
        let action = $('#action').val();
   
        $('#action_button').prop('disabled', true).html("sending....");
    $.ajax({
      url: '/contact/add',
      method: 'POST',
      data: { name, mobileNo, group, id, action },
      dataType: "JSON",
      // ... (your existing AJAX settings)
      success: function (response) {
       
        if (response.flag === 1) {
          toastr.success(response.msg);
           $('#action_button').prop('disabled', false).html("save change....");
    
          setTimeout(function () {
            $('#action_modal').modal('hide');
            getItems(currentPage, currentname, currentmobile, currentgroups, itemsPerPage);
          }, 500);
        } else if (response.flag === 0) {
          toastr.error(response.msg);
           $('#action_button').prop('disabled', false).html("save change....");
        }
      },
    });
  });
};



const deleteData = () => {
  $(document).on('click', '.deleteForm', function (e) {
    e.preventDefault();

    var id = $(this).find('.deleteId').val();

    // Prompt the confirmation dialog
    if (confirmDelete()) {
      $.ajax({
        url: '/dashboard/delete',
        method: 'POST',
        data: {
          id: id
        },
        success: function (response) {
          if(response.flag === 1){
            toastr.success(response.msg);
            setTimeout(function () {
               getItems(currentPage,currentname,currentmobile,currentgroups,itemsPerPage);
            }, 500);
        }else if(response.flag === 0){
            toastr.error(response.msg);
        }
        },
        error: function (xhr, status, error) {
          console.error("Error:", error);

          try {
            const jsonError = JSON.parse(xhr.responseText);
            $('#error-message').text(JSON.stringify(jsonError.msg, null, 2));
          } catch (e) {
            $('#error-message').text(JSON.stringify({ error: error }, null, 2));
          }
        }
      });
    }
  });
};


$(document).ready(function () {
  

  getItems(currentPage,currentname,currentmobile,currentgroups,itemsPerPage);
  addData();
  deleteData();
  search();
  editForm();
  pageform();
  getGroupName(); 
 
  document.getElementById('resetForm').addEventListener('click', function () {
   
    $('#resetForm').prop('disabled', true);
    currentname = document.getElementById('searchname').value = '';
    currentmobile = document.getElementById('mobile').value = '';
    currentgroups = document.getElementById('group').value = '';
    getItems(currentPage,currentname,currentmobile,currentgroups,itemsPerPage);
    setTimeout(function () {
     
      $('#resetForm').prop('disabled', false);
   }, 500);
     
});
$('#add_data').click(function () {

    $('#dynamic_modal_title').text('Add Data');

    $('#sample_form')[0].reset();

    $('#action').val('Add');

    $('#action_button').text('Add');
    // $('#action_button').prop('disabled', true);
    $('#action_modal').modal('show');

  });


 




});
