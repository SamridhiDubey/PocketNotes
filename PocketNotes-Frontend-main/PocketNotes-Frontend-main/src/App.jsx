import { useState, useEffect } from 'react'
import Logo from './assets/welcomelogo.png'
import './App.css'

function App() {
  const [isActive, setIsActive] = useState(true);
  const [isAddchat, setIsAddchat] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [textareaValue, setTextareaValue] = useState(false);
  const [isGroupSelected, setGroupSelected] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);


  const handleClick = () => {
    setIsActive(!isActive);
  };

  const handleAddChat = () => {
    setIsAddchat(!isAddchat);
  };

  const handleInputChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.id);
  };

  const colorMapping = {
    colour1: '#b38bfa',
    colour2: '#ff79f2',
    colour3: '#43e6fc',
    colour4: '#f19576',
    colour5: '#0047ff',
    colour6: '#6691ff',
  };

  // const appUrl = process.env.APP_URL;
  const appUrl = 'https://pocket-notes-eight-inky.vercel.app/';
  const handleCreateGroup = async () => {

    const nameParts = groupName.trim().split(' ');
    const initials = nameParts.length > 1
      ? nameParts[0][0].toUpperCase() + nameParts[nameParts.length - 1][0].toUpperCase()
      : nameParts[0][0].toUpperCase();

      const deviceIdentifier = generateDeviceIdentifier();

    const newGroup = {
      deviceIdentifier,
      name: groupName,
      initials,
      color: selectedColor
    };
    try {
      await fetch(`${appUrl}api/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
      });

      await fetchGroups();

    setGroupName('');
    setSelectedColor('');
    setIsAddchat(false);
    }catch (error) {
      console.error('Error creating group:', error);
    }

  };
  const handleGroupClick = (group) => {
    setGroupSelected(true);
    setSelectedGroup(group);
    fetchMessages(group._id);
    setIsActive(false)
  };



  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
    setInputText(e.target.value);
  };


const handleSvgClick = async () => {
  if (inputText.trim() !== '') {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedTime = new Date().toLocaleTimeString('en-US', options);
    const deviceIdentifier = generateDeviceIdentifier();
    const newMessage = {
      deviceIdentifier,
      groupId: selectedGroup._id,
      text: inputText,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: formattedTime,
    };

    try {
      await fetch(`${appUrl}api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      await fetchMessages(selectedGroup._id);

      setInputText('');
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }
  setTextareaValue(false);
};

const fetchMessages = async (groupId) => {
  try {
    const response = await fetch(`${appUrl}api/messages/${groupId}`);
    const data = await response.json();

    console.log("groupId", groupId)
    console.log("data", data)

    if (data.success) {
      setChatMessages((prevChatMessages) => ({
        ...prevChatMessages,
        [groupId]: data.messages,
      }));
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
};

console.log("chat", chatMessages)

// ... (rest of the code)

  const fetchGroups = async () => {
    try {
      const response = await fetch(`${appUrl}api/groups`);
      const data = await response.json();
  
      if (data.success) {
        setGroups(data.groups);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };
  function generateDeviceIdentifier() {
    return `device_${Math.random().toString(36).substring(7)}`;
  }
  useEffect(() => {
    fetchGroups();
  }, []);

  
  const svgClassName = textareaValue ? '' : 'fill';
  console.log(selectedGroup);


  return (
    <>
      <div className="app">
        <div className="side-menu">
          <h1>Pocket Notes</h1>
          <div className="history">
            {groups.map((group) => (
              <div className={`info ${selectedGroup === group ? 'selected' : ''}`} key={group._id} onClick={() => handleGroupClick(group)}>
                <h2 className='initials' style={{ backgroundColor: colorMapping[group.color] }}>{group.initials}</h2>
                <p>{group.name}</p>
              </div>
            ))}
          </div>
          <div className="add" onClick={handleAddChat}>+</div>
        </div>
        <div className={`main-menu ${isActive ? 'active' : ''}`}>



          <div className={`chat-head ${isGroupSelected ? '' : 'none'}`} >
            <div className="info-head">
              <svg onClick={handleClick} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#ffffff"></path> </g></svg>
              {selectedGroup && (
                <>
                  <h2 style={{ backgroundColor: colorMapping[selectedGroup.color] }}>{selectedGroup.initials}</h2>
                  <p>{selectedGroup.name}</p>
                </>
              )}
            </div>
          </div>
          <div className={`chat ${isGroupSelected ? '' : 'none'}`}>
            {selectedGroup && chatMessages[selectedGroup._id] && chatMessages[selectedGroup._id].map((message) => (
              <div className="chat-text" key={message._id}>
                <p className="chats">{message.text}</p>
                <div className="date">
                  <p>{message.date}</p>
                  <p>{message.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={`chat-input ${isGroupSelected ? '' : 'none'}`}>
            <textarea rows="5" placeholder='Enter your text here........' value={inputText} onChange={handleTextareaChange}></textarea>
            <svg onClick={handleSvgClick} className={svgClassName} fill="#001f8b" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">  <g id="surface1"> <path d="M2,3v7.8L18,12L2,13.2V21l20-9L2,3z"></path> </g> <rect class="st0" width="24" height="24"></rect> </g></svg>
          </div>


          <div className={`welcome-info ${isGroupSelected ? 'none' : ''}`}>
            <img src={Logo} alt="logo" />
            <h1>Pocket Notes</h1>
            <p>Send and recieve message without keeping your phone online.</p>
            <p>Use Pockets Notes on up to 4 linked device and 1 mobile phone</p>
          </div>
          <div className={`safety ${isGroupSelected ? 'none' : ''}`}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00001 5V8.00415C7.50208 8.01124 7.05704 8.03041 6.67222 8.08214C6.0167 8.17028 5.38835 8.36902 4.87869 8.87868C4.36902 9.38835 4.17028 10.0167 4.08215 10.6722C3.99991 11.2839 3.99995 12.0477 4 12.9342V17.0658C3.99995 17.9523 3.99991 18.7161 4.08215 19.3278C4.17028 19.9833 4.36902 20.6117 4.87869 21.1213C5.38835 21.631 6.0167 21.8297 6.67222 21.9179C7.28387 22.0001 8.0477 22.0001 8.93417 22H15.0659C15.9523 22.0001 16.7161 22.0001 17.3278 21.9179C17.9833 21.8297 18.6117 21.631 19.1213 21.1213C19.631 20.6117 19.8297 19.9833 19.9179 19.3278C20.0001 18.7161 20.0001 17.9523 20 17.0658V12.9342C20.0001 12.0477 20.0001 11.2839 19.9179 10.6722C19.8297 10.0167 19.631 9.38835 19.1213 8.87868C18.6117 8.36902 17.9833 8.17028 17.3278 8.08215C16.943 8.03041 16.4979 8.01124 16 8.00415V5C16 3.34315 14.6569 2 13 2H11C9.34316 2 8.00001 3.34315 8.00001 5ZM11 4C10.4477 4 10 4.44772 10 5V8L14 8V5C14 4.44772 13.5523 4 13 4H11ZM12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13Z" fill="#000000"></path> </g></svg>
            <p>end-to-end encrypted</p>
          </div>
        </div>

        <div className={`pop-up ${isAddchat ? 'display' : ''}`} onClick={handleAddChat}>

        </div>
        <div className={`add-chat ${isAddchat ? 'display' : ''}`}>
          <h1>Create New group</h1>
          <div className="group">
            <label htmlFor="group-name">Group Name</label>
            <input
              type="text"
              placeholder='Enter group name'
              id='group-name'
              value={groupName}
              onChange={handleInputChange}
            />
          </div>

          <div className="colour">
            <p>Choose colour</p>
            <input type="radio" name="colour" id="colour1" onChange={handleColorChange} /><label htmlFor="colour1" ></label>
            <input type="radio" name="colour" id="colour2" onChange={handleColorChange} /><label htmlFor="colour2"></label>
            <input type="radio" name="colour" id="colour3" onChange={handleColorChange} /><label htmlFor="colour3"></label>
            <input type="radio" name="colour" id="colour4" onChange={handleColorChange} /><label htmlFor="colour4"></label>
            <input type="radio" name="colour" id="colour5" onChange={handleColorChange} /><label htmlFor="colour5"></label>
            <input type="radio" name="colour" id="colour6" onChange={handleColorChange} /><label htmlFor="colour6"></label>
          </div>
          <div className="btn">
            <button onClick={handleCreateGroup}>Create</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
