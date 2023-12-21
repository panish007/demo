let currentPage = 1;
let currentsearch = '';
let itemsPerPage = 3;

function getItems(page,search,PerPage) {
    $.ajax({
      url: '/group',
      type: 'post',
      data: {
        page: page,search,PerPage
        
      },
      success: function (data) {
        $('#searching').prop('disabled', false);
        $('#Itembtn').prop('disabled', false);
        currentPage = data.current
        displayItems(data.data);
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
  
  
  function displayItems(group) {
    const itemList = $('#table');
  
    // Clear existing content before updating
    itemList.empty();
  
    // Check if the 'group' array has elements
   
      // Append the opening tag of the table
      itemList.append(`
        <div class="table-responsive" >
        <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col"> Name</th>
              <th scope="col">Created At</th>
              <th scope="col" class="text-end">Action</th>
            </tr>
          </thead>
          <tbody>
      `);
  
      if (group.length > 0) {
      group.forEach(element => {
        itemList.append(`
  
        
        <div class="table-responsive">
            <table class="table table-striped table-sm">
                <thead>
                    <tr class="col align-middle">
                        <th scope="col" class="align-middle">${element.name}</th>
                        
                       
                        <th scope="col" class="align-middle" style="margin-left:3rem">${formatStartingDate(element.startingDate)}</th>
                        <th class="text-end align-middle">
                            <div class="d-flex flex-row justify-content-end gap-2">
                                <!-- Your action buttons here -->
                              
                               <button type="button"  class="btn btn-warning btn-sm edit" data-id="${element._id}">
                             
                               <i class="bi bi-pencil"></i></td> 
                                    </button>
                            
                                    <form class="position-relative deleteForm" onsubmit="return confirmDelete();">
                                    <input type="hidden" class="groupName" name="groupName" value="${element.name}">
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
 
  
  function displayPagination(currentPage, totalPages) {
    const paginationContainer = $('#pagination');
  
    // Clear existing pagination before updating
    paginationContainer.empty();
  
    // Add pagination components if there are more than one page
    if (totalPages > 1) {
      paginationContainer.append(`
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content">
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
              <a class="page-link" href="#" onclick="getItems(${currentPage - 1},'${currentsearch}','${itemsPerPage}')" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      `);
  
      for (let i = 1; i <= totalPages; i++) {
        paginationContainer.find('ul').append(`
          <li class="page-item ${currentPage === i ? 'active' : ''}">
            <a class="page-link" href="#" onclick="return getItems(${i},'${currentsearch}','${itemsPerPage}')">${i}</a>
          </li>
        `);
      }
  
      paginationContainer.append(`
        <nav aria-label="Page navigation">
          <ul class="pagination justify-content-end">
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
              <a class="page-link" href="#" onclick="return getItems(${currentPage + 1},'${currentsearch}','${itemsPerPage}')" aria-label="Next">
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
  
      let name = $('#search').val();
   
    
      currentsearch = name;
      $('#searching').prop('disabled', true);
       getItems(1,name,itemsPerPage);
       currentPage = 1;
    });
  }
  
  const pageform = () => {
    $('#itemspage').on('submit', (e) => {
      $('#resetForm').prop('disabled', true);
      e.preventDefault();
  
      let perPage = $('#perpage').val();
      itemsPerPage = perPage;
  
      $('#Itembtn').prop('disabled', true);
     
      getItems(1,currentsearch, perPage);
    });
  }
  
  
 


  const editForm = () => {
    var id = $(this).data('id');
    // Move this outside the click event handler
    function displayEditForm(id) {
      $('#dynamic_modal_title').text('Edit Data');
      $('#action').val('Edit');
      $('#contactid').val(id);
      $('#action_button').text('Edit');
      $('#action_modal').modal('show');
      
      $.ajax({
        url: 'group/get',
        method: 'POST',
        data: { id: id },
        success: function (data) {
          $('#name').val(data.data.name);
          $('#contactid').val(id);
          $('#updatename').val(data.data.name);
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
      let id = $('#contactid').val();
      let action = $('#action').val();
      let beforeUpdate = $('#updatename').val();
      $('#groupbtn').prop('disabled', true).html("sending..");
      
      $.ajax({
        url: '/group/add',
        method: 'POST',
        data: {
          name: name,
          id:id,
          action:action,
          groupname:beforeUpdate
        },
        success: function (response) {
          if(response.flag === 1){
            $('#groupbtn').prop('disabled', false).html("Save Changes..");
            toastr.success(response.msg);
            setTimeout(function () {
              $('#action_modal').modal('hide');
              getItems(currentPage,currentsearch,itemsPerPage);
            }, 500);
        }else if(response.flag === 0){
          $('#groupbtn').prop('disabled', false).html("Save Changes..");
            toastr.error(response.msg);
        }
        },
      });
    });
  }
  
  const deleteData = () => {
    $(document).on('click', '.deleteForm', function (e) {
      e.preventDefault();
  
      var id = $(this).find('.deleteId').val();
      var groupName = $(this).find('.groupName').val();
     
      // Prompt the confirmation dialog
      if (confirmDelete()) {
        $.ajax({
          url: '/group/delete',
          method: 'POST',
          data: {
            id: id,
            groupName: groupName
          },
     
            success: function (response) {
              if(response.flag === 1){
                toastr.success(response.msg);
                setTimeout(function () {
                  getItems(currentPage,currentsearch,itemsPerPage);
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
    getItems(currentPage,currentsearch,itemsPerPage);
    addData();
    deleteData();
    search();
    editForm();
    pageform();
  
    $('#add_data').click(function () {
  
      $('#dynamic_modal_title').text('Add Group');
  
      $('#sample_form')[0].reset();
  
      $('#action').val('Add');
  
      $('#action_button').text('Add');
  
      $('#action_modal').modal('show');
  
    });


    document.getElementById('resetForm').addEventListener('click', function () {
          // Reset all input fields
          $('#resetForm').prop('disabled', true);
      currentsearch = document.getElementById('search').value = '';

       getItems(currentPage,currentsearch,itemsPerPage);
       setTimeout(function () {
     
        $('#resetForm').prop('disabled', false);
     }, 500);
     
  });
  



    $('.nav-link').click(function () {
      // Remove 'active' class from all links
      $('.nav-link').removeClass('active');
      // Add 'active' class to the clicked link
      $(this).addClass('active');
    });
  
  
  });
  