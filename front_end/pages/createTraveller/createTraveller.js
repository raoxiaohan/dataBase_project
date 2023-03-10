let app = getApp();
let utils = require('../../utils/utils');
let dateFormat = require('../../utils/dateutil');
Page({
  data:{
        checked:true,
				iconMan:'success',
				iconWoman:'circle',
		type:0,
		pass_id:0
    },
    onLoad:function(params){
	  let that=this;
	this.type=params.type;
	that.data.type=params.type;
	this.id=params.id;
	console.log(this.id)
	that.data.pass_id=params.id;
	let passengerInfo=this.passengerInfo= wx.getStorageSync('passengerInfo');
	console.log(passengerInfo)
    this.passengerList=passengerInfo.pass_list;
    this.selectedPassengerList=passengerInfo.selectedPassengerList;
    let data={};
    let nowYear=new Date().getFullYear();
  	let startDate='1900-01-01';
  	let endDateF=dateFormat.formatDay(new Date(nowYear+100,0,1));
  	this.cardTypeKeys=Object.keys(utils.cardTypes);
	  this.cardTypeValues=Object.values(utils.cardTypes);
	  this.customerTypeKeys=Object.keys(utils.customerTypes);
    this.customerTypeValues=Object.values(utils.customerTypes);
	  this.countryOptionValues=[];
	  this.countryOptionKeys=[];
  	  Object.assign(data,{
    		cardTypeValues:this.cardTypeValues,
    		cardType:0,
    		startDate:startDate,
      	endDate:dateFormat.formatDay(new Date()),
      	endDateF:endDateF,
      	customerTypeValues:this.customerTypeValues,
      	customerType:0,
      	countryOptionValues:this.countryOptionValues,
      	countryValue:0,
      	checkCityValue:0,
      	isPassport:passengerInfo.isInternational?true:false,
      	isInternational:passengerInfo.isInternational,
      	gender:true,
      	name:'',
      	firstName:'',
      	lastName:'',
      	phone:'',
      	cardNo:'',
      	checkDate:'',
      	passportExpireDate:'',
      	birthday:''
  	  })

      if(this.id!=undefined){
      	let passengerItem= this.passengerList.filter(function(item){
      		return item.id==that.id;
      	})[0];
      	if(passengerItem){      
			console.log(passengerItem)		
      		Object.assign(data,{      			
      			cardType:passengerItem.CardType?this.cardTypeKeys.indexOf(passengerItem.CardType.toString()):0,
      			name:passengerItem.name||'',
      			phone:passengerItem.phone||'',
      			cardNo:passengerItem.cardnum||'',      			
      			
      		});
      	}
      }
      this.setData(data);
    },

    bindswitchchange:function(e){ 
     this.setData({
            checked:e.detail.value
        })
    },
    bindSelectCardChange:function(e){
    	
    	let type=e.detail.value;
    	let isPassport= utils.isPassport(this.cardTypeKeys[type]);
    	this.setData({
    		isPassport:isPassport,
    		cardType:type
    	});
    },
    bindSelectChange:function(e){
    	let key=e.currentTarget.dataset.key;
    	let data={};
    	data[key]=e.detail.value;
    	this.setData(data);
    },
    formBindsubmit:function(e){
    	var msg='';
    	if(this.isInternational)
    		msg=this.verifyInternational(e.detail.value);
    	else
    		msg=this.verify(e.detail.value);
    	if(msg){
    		utils.message(msg);
    	}else{
        this.submit(e.detail.value);
    	}
    },
    submit:function(value){
		console.log('abv')
		let that=this;
		let pass_id=that.data.pass_id
		console.log(pass_id)
		var app=getApp()
	 	let user_id=app.globalData.userid
		if(that.data.type==2){
			wx.request({
				url: 'http://127.0.0.1:8000/wx/wx_login/',
				method:'POST',
				header:{
				  "content-type": "application/x-www-form-urlencoded"		//??????POST?????????????????????header
				},
			   data:{
				  action:'create_pass',
				  id:pass_id,
				  user_id:user_id,
				  name:value.name,
				  cardnum:value.cardNo,
				  phone:value.phone,
				},
				success: res => {
				  console.log(res)   
				  wx.navigateBack({
					delta: 1,
				  })
				},
			})
		}
	},
    //     if(this.padding)return;
	// 	this.padding=true;
	// 	var app=getApp()
	// 	let user_id=app.globalData.userid
	// 	console.log(user_id)
	// 	wx.request({
	// 		url: 'http://127.0.0.1:8000/wx/wx_login/',
	// 		method:'POST',
	// 		header:{
	// 		  "content-type": "application/x-www-form-urlencoded"		//??????POST?????????????????????header
	// 		},
	// 	   data:{
	// 		  action:'create_pass',
	// 		  user_id:user_id,
	// 		  name:value.name,
	// 		  cardnum:value.cardNo,
	// 		  phone:value.phone,
	// 		},
	// 		success: res => {
	// 		  console.log(res)   
	// 		  wx.navigateBack({
	// 			delta: that.type*1,
	// 		  })
	// 		},
	// 	})
	// },
	

    	// .then(function(data){
        //     wx.hideToast();
        //     that.padding=false;
        //     if(data.Code==4){
        //       app.login().then(function(){
        //         utils.message('?????????????????????????????????????????????????????????');
        //       })
        //     }else if(data.Code==200){
        //       that.setPassengerInfo(data,value);
        //       let fn=app.globalData.refreshPassenger;
        //       if(typeof fn=='function')
        //         setTimeout(fn,0);
        //       wx.navigateBack({
        //         delta:that.type*1
        //       });
        //     }else if(data.Msg){
        //       utils.message(data.Msg);
        //     }
        //   }).catch(function(e){
        //     console.log(e);       
        //   })
    
    setPassengerInfo:function(data,value){
    	let newID=data.Data.PassengerIDList[0];
    	let passengerItem={
    		ID:newID,
    		Birthday:value.birthday,
    		CardNo:value.cardNo,
    		CardType:this.cardTypeKeys[value.cardType],
    		CheckCity:this.countryOptionValues[value.checkCityValue],
    		CheckCityCode:this.countryOptionKeys[value.checkCityValue],
    		CheckDate:value.checkDate,
    		City:'',
    		Country:'',
    		CountryName:this.countryOptionValues[value.countryValue],
    		CountryCode:this.countryOptionKeys[value.countryValue],
    		Gender:value.gender==1,
    		MobilePhone:value.phone,
    		PassengerName:value.name,
    		PassengerNameEN:(value.firstName||'') +'/'+(value.lastName||''),
    		PassengerType:this.customerTypeKeys[value.customerType],
    		PassportExpireDate:value.passportExpireDate
    	}

  		this.passengerList=this.passengerList.filter((item)=>{
  			return item.ID!=this.id
  		});
      this.passengerList.unshift(passengerItem);
  		this.selectedPassengerList=this.selectedPassengerList.filter((item)=>{
  			return item!=this.id;
  		});
      this.selectedPassengerList.unshift(newID);
    	wx.setStorageSync('passengerInfo',Object.assign({},this.passengerInfo,{
    		passengerList:this.passengerList,
    		selectedPassengerList:this.selectedPassengerList
    	}))
    }
    ,
    verify:function(value){
    	let msg='';
    	let isPassport=this.data.isPassport;
    	if(!value.name){
    		msg='?????????????????????????????????';
    	}else if(!utils.verifyName(value.name)){
    		msg='?????????????????????????????????';
    	}else if(!utils.verifyPhone(value.phone)){
    		msg='????????????????????????';
    	}else if(!value.cardNo){
    		msg="???????????????????????????";
    	}else if(value.cardType==0&&!utils.verifyIdentity(value.cardNo)){
        msg="??????????????????????????????";
      }
    	return msg;
    },
    verifyInternational:function(value){
    	let msg='';
    	let isPassport=this.data.isPassport;
    	if(!value.name){
    		msg='?????????????????????????????????';
    	}else if(!utils.verifyName(value.name)){
    		msg='?????????????????????????????????';
    	}else if(!value.firstName){
    		msg='??????????????????????????????';
    	}else if(!utils.verifyFirstName(value.firstName)){
    		msg='??????????????????????????????';
    	}else if(!value.lastName){
    		msg='??????????????????????????????';
    	}else if(!utils.verifyLastName(value.lastName)){
    		msg='??????????????????????????????';
    	}else if(!utils.verifyPhone(value.phone)){
    		msg='????????????????????????';
    	}else if(!value.birthday){
    		msg="?????????????????????";
    	}else if(!value.cardNo){
    		msg="???????????????????????????";
    	}else if(value.cardType==0&&!utils.varifyPassport(value.cardNo)){
        msg='?????????????????????';
      }else if(!value.passportExpireDate){
    		msg="??????????????????????????????";
    	}else if(!value.checkDate){
    		msg='?????????????????????????????????';
    	}
    	return msg;
    }
    // ,
    // radioChange:function(e){
    // 	let value=e.detail.value;
    // 	this.setData({
    // 		gender:value==1
    // 	})

    // }
 
})
