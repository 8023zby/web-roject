// 手术患者交接记录单
export const operationHandoverData2 = [
{
	"columns": [{
		"padding": "0",
		"gapLR": "0",
		"children": [{
			"type": "date",
			"value": "",
			"config": {
				"prefix": "手术日期",
				"prefixWidth": "75px",
				"noCenter": true,
				"borderLine": true,
				"readonly": false,
				"prefixAlign": "right",
				"width": "240px",
				"disabled": false,
				'type': 'datetime',
				'showFormat': 'yyyy-MM-dd'
			},
			"key": "1601364493000_365518"
		}],
		"flex": "1",
		"justify": "flex-start",
		"width": "",
		"childWidth": "",
		"align": "",
		"gapTB": "1px",
		"direction": "row"
	}, {
		"padding": "0 30px 0 0",
		"gapLR": "0",
		"children": [{
			"options": [{
				"score": 0,
				"id": "1615966742000_25044-0",
				"label": "急症",
				"labelSize": "24px",
				"labelPadSize": "18px"
			}, {
				"score": 0,
				"id": "1615966742000_25044-1",
				"label": "择期",
				"labelSize": "24px",
				"labelPadSize": "18px"
			}],
			"type": "checkbox",
			"value": [],
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "",
				"prefixAlign": "left",
				"disabled": false,
				"inputType": "checkbox",
				"prefixWidth": "",
				"isRadio": true
			},
			"key": "1615966742000_25044"
		}],
		"flex": "1",
		"justify": "center",
		"width": "",
		"childWidth": "",
		"align": "",
		"gapTB": "0",
		"direction": "row"
	}],
	"type": "grid",
	"value": "",
	"config": {
		"borderColor": "#ddd",
		"borderWidth": "0",
		"borderStyle": "solid"
	},
	"key": "1615966742000_35557"
},
{
	"columns": [{
		"padding": "0 10px",
		"gapLR": "0",
		"children": [{
			"type": "text",
			"value": "",
			"config": {
				"weight": "100px",
				"label": "",
				"align": "center"
			},
			"key": "1615966742000_43864"
		}],
		"flex": "",
		"justify": "center",
		"width": "60px",
		"childWidth": "",
		"align": "",
		"gapTB": "0",
		"direction": "row"
	}, {
		"padding": "0 1px 0 0",
		"gapLR": "0",
		"children": [{
			"type": "text",
			"value": "",
			"config": {
				"weight": "auto",
				"label": "术前",
				"align": "center"
			},
			"key": "1615966742000_447"
		}],
		"flex": 1,
		"justify": "center",
		"width": "auto",
		"childWidth": "auto",
		"align": "center",
		"gapTB": "0",
		"direction": "row"
	}, {
		"padding": "0 1px",
		"gapLR": "0",
		"children": [{
			"type": "text",
			"value": "",
			"config": {
				"weight": "auto",
				"label": "术后",
				"align": "center"
			},
			"key": "1615966742000_99434"
		}],
		"flex": 2,
		"justify": "center",
		"width": "auto",
		"childWidth": "100%",
		"align": "center",
		"gapTB": "0",
		"direction": "row"
	}],
	"type": "grid",
	"value": "",
	"config": {
		"borderColor": "#ddd",
		"borderWidth": "1px",
		"borderStyle": "solid"
	},
	"key": "1615966742000_44782"
},
{
	"columns": [{
		"padding": "0 10px",
		"gapLR": "0",
		"children": [{
			"type": "text",
			"value": "",
			"config": {
				"weight": "60px",
				"label": "S",
				"align": "center"
			},
			"key": "1615966742000_28986"
		}, {
			"type": "text",
			"value": "",
			"config": {
				"weight": "60px",
				"label": "现状",
				"align": "center"
			},
			"key": "1615966742000_33108"
		}],
		"flex": "",
		"justify": "center",
		"width": "60px",
		"childWidth": "",
		"align": "center",
		"gapTB": "0",
		"direction": "column"
	}, {
		"padding": "0 1px 0 5px",
		"gapLR": "0",
		"children": [{
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "诊断:",
				"prefixAlign": "left",
				"width": "240px",
				"disabled": false,
				"inputType": "text",
				"prefixWidth": "50px"
			},
			"key": "1606284173000_32570"
		}, {
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "拟手术名称:",
				"prefixAlign": "left",
				"width": "190px",
				"disabled": false,
				"inputType": "text",
				"prefixWidth": "100px"
			},
			"key": "1615966742000_13949"
		}],
		"flex": 1,
		"justify": "flex-start",
		"width": "",
		"childWidth": "",
		"align": "center",
		"gapTB": "1px",
		"direction": "row"
	}, {
		"padding": "0 6px",
		"gapLR": "0",
		"children": [{
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "手术名称:",
				"prefixAlign": "left",
				"width": "350px",
				"disabled": false,
				"inputType": "text",
				"prefixWidth": "85px"
			},
			"key": "1615966742000_84171"
		}, {
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "麻醉方式:",
				"prefixAlign": "left",
				"width": "350px",
				"disabled": false,
				"inputType": "text",
				"prefixWidth": "85px"
			},
			"key": "1615966742000_40162"
		}],
		"flex": 2,
		"justify": "flex-start",
		"width": "",
		"childWidth": "",
		"align": "center",
		"gapTB": "1px",
		"direction": "row"
	}],
	"type": "grid",
	"value": "",
	"config": {
		"borderColor": "#ddd",
		"borderWidth": "1px",
		"borderStyle": "solid"
	},
	"key": "1615966742000_18905"
},
{
	"columns": [{
		"padding": "0 10px",
		"gapLR": "0",
		"children": [{
			"type": "text",
			"value": "",
			"config": {
				"weight": "100px",
				"label": "B",
				"align": "center"
			},
			"key": "1615966742000_81604"
		}, {
			"type": "text",
			"value": "",
			"config": {
				"weight": "100px",
				"label": "背景",
				"align": "center"
			},
			"key": "1615966742000_44772"
		}],
		"flex": "",
		"justify": "center",
		"width": "60px",
		"childWidth": "",
		"align": "center",
		"gapTB": "0",
		"direction": "column"
	}, {
		"padding": "",
		"gapLR": "5px",
		"children": [{
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "体重:",
				"prefixAlign": "left",
				"width": "100px",
				"disabled": false,
				"suffix": "Kg",
				"inputType": "text",
				"prefixWidth": "50px",
				"noCenter": true
			},
			"key": "1615966742000_53422"
		}, {
			"options": [{
				"score": 0,
				"id": "1615966742000_34556-0",
				"label": "无"
			}, {
				"score": 0,
				"id": "1615966742000_34556-1",
				"label": "有"
			}],
			"type": "checkbox",
			"value": [],
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "过敏史:",
				"prefixAlign": "left",
				"disabled": false,
				"inputType": "checkbox",
				"prefixWidth": "60px",
				"isRadio": true
			},
			"key": "1615966742000_34556"
		}, {
			"options": [{
				"score": 0,
				"id": "1615966742000_93396-0",
				"label": "否"
			}, {
				"score": 0,
				"id": "1615966742000_93396-1",
				"label": "是"
			}],
			"type": "checkbox",
			"value": [],
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "月经期:",
				"prefixAlign": "left",
				"disabled": false,
				"inputType": "checkbox",
				"prefixWidth": "60px",
				"isRadio": true
			},
			"key": "1615966742000_93396"
		}, {
			"options": [{
				"score": 0,
				"id": "1615966742000_30011-0",
				"label": "否"
			}, {
				"score": 0,
				"id": "1615966742000_30011-1",
				"label": "是"
			}],
			"type": "checkbox",
			"value": [],
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "术前禁饮食:",
				"prefixAlign": "left",
				"disabled": false,
				"inputType": "checkbox",
				"prefixWidth": "95px",
				"isRadio": true
			},
			"key": "1615966742000_30011"
		}, {
			"options": [{
				"score": 0,
				"id": "1615966742000_51265-0",
				"label": "否"
			}, {
				"score": 0,
				"id": "1615966742000_51265-1",
				"label": "是"
			}],
			"type": "checkbox",
			"value": [],
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "手术标记:",
				"prefixAlign": "left",
				"disabled": false,
				"inputType": "checkbox",
				"prefixWidth": "85px",
				"isRadio": true
			},
			"key": "1615966742000_51265"
		}, {
			"options": [{
				"score": 0,
				"id": "1615966742000_85404-0",
				"label": "无",
				'marginRight': '5px'
			}, {
				"score": 0,
				"id": "1615966742000_85404-1",
				"label": "已执行",
				'marginRight': '5px'
			}, {
				"score": 0,
				"id": "1615966742000_85404-2",
				"label": "未执行",
				'marginRight': '0'
			}],
			"type": "checkbox",
			"value": [],
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "术前用药:",
				"prefixAlign": "left",
				"disabled": false,
				"inputType": "checkbox",
				"prefixWidth": "85px",
				"isRadio": true
			},
			"key": "1615966742000_85404"
		}],
		"flex": 1,
		"justify": "flex-start",
		"width": "",
		"childWidth": "100%",
		"align": "flex-start",
		'gapTB': '2px',
		"direction": "row"
	}, {
		"padding": " ",
		"gapLR": "",
		"children": [{
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "术中:",
				"prefixAlign": "right",
				"width": "380px",
				"disabled": false,
				"inputType": "text",
				"prefixWidth": "45px",
				"noCenter": true
			},
			"key": "1615966742000_58330"
		}, {
			"options": [{
				"score": 0,
				"id": "1615966742000_82359-0",
				"label": "平卧位"
			}, {
				"score": 0,
				"id": "1615966742000_82359-1",
				"label": "侧卧位",
				'children': [
				{
					"score": 0,
					"mConfig": {},
					"type": "text",
					"value": '',
					"config": {
						"borderLine": true,
						'label': '(',
						"width": "10px",
						"inputType": "text",
					},
					"key": "1615966742000_862359"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_824359-0",
						"label": "左"
					}, {
						"score": 0,
						"id": "1615966742000_824359-1",
						"label": "右",
					}],
					"score": 0,
					"mConfig": {},
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "",
						"prefixAlign": "right",
						"width": "",
						"disabled": false,
						"inputType": "checkbox",
						"prefixWidth": "",
						"isRadio": true,
						'keyDisabled': '1615966742000_82359-1',
					},
					"key": "1615966742000_8623591"
				}, {
						"score": 0,
						"mConfig": {},
						"type": "text",
						"value": '',
						"config": {
							"borderLine": true,
							'label': '）',
							"width": "10px",
							"inputType": "text",
						},
						"key": "1615966742000_8623590"
					}]
			}, {
				"score": 0,
				"id": "1615966742000_82359-2",
				"label": "俯卧位"
			}, {
				"score": 0,
				"id": "1615966742000_82359-3",
				"label": "截石位"
			}, {
				"score": 0,
				"id": "1615966742000_82359-4",
				"label": "牵引位"
			}, {
				"score": 0,
				"id": "1615966742000_82359-5",
				"label": "沙滩椅位"
			}],
			"score": 0,
			"mConfig": {},
			"type": "checkbox",
			"value": [],
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "手术体位:",
				"prefixAlign": "right",
				"width": "380px",
				"disabled": false,
				"inputType": "checkbox",
				"prefixWidth": "80px",
				"isRadio": true
			},
			"key": "1615966742000_82359"
		}, {
			"columns": [{
				"padding": "3px 0",
				"gapLR": "0",
				"children": [{
					"score": 0,
					"mConfig": {},
					"type": "text",
					"value": "",
					"config": {
						"label": "术后去向",
						"align": "center",
						"width": "100%",
						"inputType": "text",
						"border": true
					},
					"key": "1615966742000_89878"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "",
				"align": "",
				"gapTB": "",
				"direction": "column"
			}],
			"type": "grid",
			"value": "",
			"config": {
				"borderColor": "#ddd",
				"borderWidth": "0px",
				"borderStyle": "solid",
				"width": "100%"
			},
			"key": "1615966742000_49601"
		}, {
			"columns": [{
				"padding": "0",
				"gapLR": "0",
				"children": [{
					"options": [{
						"score": 0,
						"id": "1615966742000_21116-0",
						"label": "PACU"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_21116"
				}],
				"flex": "",
				"justify": "center",
				"width": "50%",
				"childWidth": "",
				"align": "center",
				"gapTB": "0",
				'height': '74px',
				"direction": "column",
                "borderRight": true
			}, {
				"padding": "0",
				"gapLR": "0",
				"children": [{
					"options": [{
						"score": 0,
						"id": "1615966742000_99657-0",
						"label": "病区"
					}, {
						"score": 0,
						"id": "1615966742000_99657-1",
						"label": "ICU"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_99657"
				}],
				"flex": "",
				"justify": "center",
				"width": "50%",
				"childWidth": "",
				"align": "center",
				"gapTB": "0",
				"direction": "row"
			}],
			"type": "grid",
			"value": "",
			"config": {
				"borderColor": "#ddd",
				"borderWidth": "0",
				"borderStyle": "solid"
			},
			"key": "1615966742000_8327"
		}],
		"flex": 2,
		"justify": "flex-start",
		"width": "100%",
		"childWidth": "100%",
		"align": "center",
		"gapTB": "",
		"direction": "row"
	}],
	"type": "grid",
	"value": "",
	"config": {
		"borderColor": "#ddd",
		"borderWidth": "1px",
		"borderStyle": "solid"
	},
	"key": "1615966742000_90174"
},
{
	"mConfig": {},
	"columns": [{
		"padding": "0 10px",
		"gapLR": "0",
		"children": [{
			"mConfig": {},
			"type": "text",
			"value": "",
			"config": {
				"weight": "",
				"label": "A",
				"align": "center"
			},
			"key": "1615966742000_9932"
		}, {
			"mConfig": {},
			"type": "text",
			"value": "",
			"config": {
				"weight": "",
				"label": "评估",
				"align": "center"
			},
			"key": "1615966742000_7759"
		}],
		"flex": "",
		"justify": "center",
		"width": "60px",
		"childWidth": "",
		"align": "center",
		"gapTB": "0",
		"direction": "column"
	}, {
		"padding": "",
		"gapLR": "0",
		"children": [{
			"columns": [{
				"padding": "",
				"gapLR": "0",
				"children": [{
					"options": [{
						"score": 0,
						"id": "1615966742000_71959-0",
						"label": "身份确认"
					}, {
						"score": 0,
						"id": "1615966742000_71959-1",
						"label": "腕带"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true
					},
					"key": "1615966742000_71959"
				}],
				"flex": "1",
				"justify": "center",
				"width": "",
				"childWidth": "",
				"align": "",
				'gapTB': '2px',
				"direction": "row"
			}, {
				"padding": "",
				"gapLR": "0",
				"children": [{
					"options": [{
						"score": 0,
						"id": "1615966742000_53850-0",
						"label": "身份确认"
					}, {
						"score": 0,
						"id": "1615966742000_53850-1",
						"label": "腕带"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true
					},
					"key": "1615966742000_53850"
				}],
				"flex": "1",
				"justify": "center",
				"width": "",
				"childWidth": "",
				"align": "",
				'gapTB': '2px',
				"direction": "row"
			}, {
				"padding": "0",
				"gapLR": "0",
				"children": [{
					"options": [{
						"score": 0,
						"id": "1615966742000_43983-0",
						"label": "身份确认"
					}, {
						"score": 0,
						"id": "1615966742000_43983-1",
						"label": "腕带"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true
					},
					"key": "1615966742000_43983"
				}],
				"flex": "1",
				"justify": "center",
				"width": "",
				"childWidth": "",
				"align": "",
				'gapTB': '2px',
				"direction": "row"
			}],
			"type": "grid",
			"value": "",
			"config": {
				"borderColor": "#ddd",
				"borderWidth": "1px",
				"borderStyle": "solid"
			},
			"key": "1615966742000_79893"
		}, {
			"columns": [{
				"padding": "0",
				"gapLR": "5px",
				"children": [{
					"mConfig": {},
					"type": "text",
					"value": "",
					"config": {
						"width": "300px",
						"weight": "",
						"label": "生命体征:",
						"align": "left"
					},
					"key": "1615966742000_60386"
				}, {
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "T:",
						"width": "50px",
						"prefixAlign": "left",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "15px",
						"suffix": "℃",
						"noCenter": true,
						"suffixPaddingLeft": "16px"
					},
					"key": "1615966742000_41404"
				}, {
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "P:",
						"prefixAlign": "right",
						"width": "50px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "70px",
						"suffix": "次/分",
						"noCenter": true,
						"suffixPaddingLeft": "16px"
					},
					"key": "1615966742000_75879"
				}, {
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "BP:",
						"width": "50px",
						"prefixAlign": "left",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "15px",
						"suffix": "mmHg",
						"noCenter": true
					},
					"key": "1615966742000_18608"
				}, {
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "R:",
						"prefixAlign": "right",
						"width": "50px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "42px",
						"suffix": "次/分",
						"noCenter": true,
						"suffixPaddingLeft": "16px"
					},
					"key": "1615966742000_30921"
				}, {
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "测量时间:",
						"prefixAlign": "left",
						"width": "160px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "85px",
						"suffix": ""
					},
					"key": "1615966742000_43880"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "",
				"align": "center",
				'gapTB': '2px',
				"direction": "row"
			}, {
				"padding": "0",
				"gapLR": "5px",
				"children": [{
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "T:",
						"width": "50px",
						"prefixAlign": "left",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "15px",
						"suffix": "℃",
						"noCenter": true,
						"suffixPaddingLeft": "16px"
					},
					"key": "1615966742000_273"
				}, {
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "P:",
						"prefixAlign": "right",
						"width": "50px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "70px",
						"suffix": "次/分",
						"noCenter": true,
						"suffixPaddingLeft": "16px"
					},
					"key": "1615966742000_75734"
				}, {
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "BP:",
						"width": "150px",
						"prefixAlign": "left",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "15px",
						"suffix": "mmHg",
						"noCenter": true
					},
					"key": "1615966742000_4691"
				}, {
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "测量时间:",
						"prefixAlign": "left",
						"width": "160px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "85px",
						"suffix": ""
					},
					"key": "1615966742000_10184"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "",
				"align": "center",
				'gapTB': '2px',
				"direction": "row"
			}, {
				"padding": "0",
				"gapLR": "5px",
				"children": [{
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "T:",
						"width": "50px",
						"prefixAlign": "left",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "15px",
						"suffix": "℃",
						"noCenter": true,
						"suffixPaddingLeft": "16px"
					},
					"key": "1615966742000_78640"
				}, {
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "P:",
						"prefixAlign": "right",
						"width": "50px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "70px",
						"suffix": "次/分",
						"noCenter": true,
						"suffixPaddingLeft": "16px"
					},
					"key": "1615966742000_61756"
				}, {
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "BP:",
						"width": "150px",
						"prefixAlign": "left",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "15px",
						"suffix": "mmHg",
						"noCenter": true
					},
					"key": "1615966742000_2143"
				}, {
					"score": 0,
					"mConfig": {},
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "测量时间:",
						"prefixAlign": "left",
						"width": "160px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "85px",
						"suffix": ""
					},
					"key": "1615966742000_63681"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "",
				"align": "center",
				'gapTB': '2px',
				"direction": "row"
			}],
			"type": "grid",
			"value": "",
			"config": {
				"borderColor": "#ddd",
				"borderWidth": "1px",
				"borderStyle": "solid"
			},
			"key": "1615966742000_23036"
		}, {
			"columns": [{
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"mConfig": {},
					"type": "text",
					"value": "",
					"config": {
						"width": "300px",
						"weight": "",
						"label": "意识:",
						"align": "left"
					},
					"key": "1615966742000_37170"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_36474-0",
						"label": "清醒"
					}, {
						"score": 0,
						"id": "1615966742000_36474-1",
						"label": "嗜睡"
					}, {
						"score": 0,
						"id": "1615966742000_36474-2",
						"label": "模糊"
					}, {
						"score": 0,
						"id": "1615966742000_36474-3",
						"label": "昏睡"
					}, {
						"score": 0,
						"id": "1615966742000_36474-4",
						"label": "昏迷"
					}, {
						"score": 0,
						"id": "1615966742000_36474-5",
						"label": "谵妄"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_36474"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "100%",
				"align": "center",
				'gapTB': '2px',
				"direction": "column"
			}, {
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"mConfig": {},
					"type": "text",
					"value": "",
					"config": {
						"width": "300px",
						"weight": "",
						"label": "意识:",
						"align": "left"
					},
					"key": "1615966742000_13361"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_38661-0",
						"label": "清醒"
					}, {
						"score": 0,
						"id": "1615966742000_38661-1",
						"label": "嗜睡"
					}, {
						"score": 0,
						"id": "1615966742000_38661-2",
						"label": "模糊"
					}, {
						"score": 0,
						"id": "1615966742000_38661-3",
						"label": "昏睡"
					}, {
						"score": 0,
						"id": "1615966742000_38661-4",
						"label": "昏迷"
					}, {
						"score": 0,
						"id": "1615966742000_38661-5",
						"label": "谵妄"
					}, {
						"score": 0,
						"id": "1615966742000_38661-6",
						"label": "麻醉未拔管"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_38661"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "100%",
				"align": "center",
				'gapTB': '2px',
				"direction": "column"
			}, {
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"mConfig": {},
					"type": "text",
					"value": "",
					"config": {
						"width": "300px",
						"weight": "",
						"label": "意识:",
						"align": "left"
					},
					"key": "1615966742000_87745"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_72715-0",
						"label": "清醒"
					}, {
						"score": 0,
						"id": "1615966742000_72715-1",
						"label": "嗜睡"
					}, {
						"score": 0,
						"id": "1615966742000_72715-2",
						"label": "模糊"
					}, {
						"score": 0,
						"id": "1615966742000_72715-3",
						"label": "昏睡"
					}, {
						"score": 0,
						"id": "1615966742000_72715-4",
						"label": "昏迷"
					}, {
						"score": 0,
						"id": "1615966742000_72715-5",
						"label": "昏迷"
					}, {
						"score": 0,
						"id": "1615966742000_38661-6",
						"label": "麻醉未拔管"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_72715"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "100%",
				"align": "center",
				'gapTB': '2px',
				"direction": "column"
			}],
			"type": "grid",
			"value": "",
			"config": {
				"borderColor": "#ddd",
				"borderWidth": "1px",
				"borderStyle": "solid"
			},
			"key": "1615966742000_43458"
		}, {
			"columns": [{
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"mConfig": {},
					"type": "text",
					"value": "",
					"config": {
						"width": "300px",
						"weight": "",
						"label": "皮肤情况:",
						"align": "left"
					},
					"key": "1615966742000_88208"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_50102-0",
						"label": "完整"
					}, {
						"score": 0,
						"id": "1615966742000_50102-1",
						"label": "压疮"
					}, {
						"score": 0,
						"id": "1615966742000_50102-2",
						"label": "皮炎"
					}, {
						"score": 0,
						"id": "1615966742000_50102-3",
						"label": "破损"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"marginRight": "15px"
					},
					"key": "1615966742000_50102"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "部位:",
						"prefixAlign": "left",
						"width": "240px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "50px",
						"noCenter": true
					},
					"key": "1615966742000_4525"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_57971-0",
						"label": "合格"
					}, {
						"score": 0,
						"id": "1615966742000_57971-1",
						"label": "不合格"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"prefix": "备皮情况:",
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true
					},
					"key": "1615966742000_57971"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "100%",
				"align": "center",
				'gapTB': '2px',
				"direction": "column"
			}, {
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"mConfig": {},
					"type": "text",
					"value": "",
					"config": {
						"width": "300px",
						"weight": "",
						"label": "皮肤情况:",
						"align": "left"
					},
					"key": "1615966742000_72735"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_99863-0",
						"label": "完整"
					}, {
						"score": 0,
						"id": "1615966742000_99863-1",
						"label": "压疮"
					}, {
						"score": 0,
						"id": "1615966742000_99863-2",
						"label": "皮炎"
					}, {
						"score": 0,
						"id": "1615966742000_99863-3",
						"label": "破损"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"marginRight": "15px"
					},
					"key": "1615966742000_99863"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "部位:",
						"prefixAlign": "left",
						"width": "240px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "50px",
						"noCenter": true
					},
					"key": "1615966742000_906"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_21919-0",
						"label": "干燥"
					}, {
						"score": 0,
						"id": "1615966742000_21919-1",
						"label": "渗液"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"prefix": "伤口敷料:",
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_21919"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "100%",
				"align": "center",
				'gapTB': '2px',
				"direction": "column"
			}, {
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"mConfig": {},
					"type": "text",
					"value": "",
					"config": {
						"width": "300px",
						"weight": "",
						"label": "皮肤情况:",
						"align": "left"
					},
					"key": "1615966742000_77548"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_20535-0",
						"label": "完整"
					}, {
						"score": 0,
						"id": "1615966742000_20535-1",
						"label": "压疮"
					}, {
						"score": 0,
						"id": "1615966742000_20535-2",
						"label": "皮炎"
					}, {
						"score": 0,
						"id": "1615966742000_20535-3",
						"label": "破损"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"marginRight": "15px"
					},
					"key": "1615966742000_20535"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "部位:",
						"prefixAlign": "left",
						"width": "240px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "50px",
						"noCenter": true
					},
					"key": "1615966742000_83637"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_68745-0",
						"label": "干燥"
					}, {
						"score": 0,
						"id": "1615966742000_68745-1",
						"label": "渗液"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"prefix": "伤口敷料:",
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_68745"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "100%",
				"align": "center",
				'gapTB': '2px',
				"direction": "column"
			}],
			"type": "grid",
			"value": "",
			"config": {
				"borderColor": "#ddd",
				"borderWidth": "1px",
				"borderStyle": "solid"
			},
			"key": "1615966742000_39302"
		}, {
			"columns": [{
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"options": [{
						"score": 0,
						"id": "1615966742000_83916-0",
						"label": "无"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"prefix": "管道情况:"
					},
					"key": "1615966742000_83916"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_55393-0",
						"label": "静脉通路"
					}, {
						"score": 0,
						"id": "1615966742000_55393-1",
						"label": "动脉置管"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_55393"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_94824-0",
						"label": "气管导管",
						"marginRight": "110px"
					}, {
						"score": 0,
						"id": "1615966742000_94824-1",
						"label": "标识"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_94824"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_93590-0",
						"label": "导尿管",
						"marginRight": "128px"
					}, {
						"score": 0,
						"id": "1615966742000_93590-1",
						"label": "标识"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_93590"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_92948-0",
						"label": "胃管",
						"marginRight": "146px"
					}, {
						"score": 0,
						"id": "1615966742000_92948-1",
						"label": "标识"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_92948"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_58859-0",
						"label": "引流管",
						"children": [{
							"score": 0,
							"type": "input",
							"value": "",
							"config": {
								"borderLine": true,
								"readonly": false,
								"prefix": "",
								"prefixAlign": "left",
								"width": "60px",
								"disabled": false,
								"inputType": "input",
								"suffix": "根",
								"prefixWidth": "",
								'keyDisabled': '1615966742000_58859-0',
							},
							"key": "1615966742000_24192"
						}]
					}, {
						"score": 0,
						"id": "1615966742000_58859-1",
						"label": "标识"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_58859"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "100%",
				"align": "center",
				'gapTB': '2px',
				"direction": "column"
			}, {
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"options": [{
						"score": 0,
						"id": "1615966742000_75324-0",
						"label": "无"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"prefix": "管道情况:"
					},
					"key": "1615966742000_75324"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_66696-0",
						"label": "静脉通路"
					}, {
						"score": 0,
						"id": "1615966742000_66696-1",
						"label": "动脉置管"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_66696"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_52831-0",
						"label": "气管导管",
						"marginRight": "110px"
					}, {
						"score": 0,
						"id": "1615966742000_52831-1",
						"label": "标识"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_52831"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_7742-0",
						"label": "导尿管",
						"marginRight": "128px"
					}, {
						"score": 0,
						"id": "1615966742000_7742-1",
						"label": "标识"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_7742"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_14180-0",
						"label": "胃管",
						"marginRight": "146px"
					}, {
						"score": 0,
						"id": "1615966742000_14180-1",
						"label": "标识"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_14180"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_5234-0",
						"label": "引流管",
						"children": [{
							"score": 0,
							"type": "input",
							"value": "",
							"config": {
								"borderLine": true,
								"readonly": false,
								"prefix": "",
								"prefixAlign": "left",
								"width": "60px",
								"disabled": false,
								"inputType": "input",
								"suffix": "根",
								"prefixWidth": "",
								'keyDisabled': '1615966742000_5234-0',
							},
							"key": "1615966742000_21314"
						}]
					}, {
						"score": 0,
						"id": "1615966742000_5234-1",
						"label": "标识"
					}, {
						"score": 0,
						"id": "1615966742000_5234-2",
						"label": "镇痛泵"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_5234"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "其他",
						"prefixAlign": "left",
						"width": "180px",
						"disabled": false,
						"inputType": "input",
						"suffix": "",
						"prefixWidth": "",
						"noCenter": true
					},
					"key": "1615966742000_17680"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "100%",
				"align": "center",
				'gapTB': '2px',
				"direction": "column"
			}, {
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"options": [{
						"score": 0,
						"id": "1615966742000_24618-0",
						"label": "无"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"prefix": "管道情况:"
					},
					"key": "1615966742000_24618"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_70881-0",
						"label": "静脉通路"
					}, {
						"score": 0,
						"id": "1615966742000_70881-1",
						"label": "动脉置管"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_70881"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_40055-0",
						"label": "气管导管",
						"marginRight": "110px"
					}, {
						"score": 0,
						"id": "1615966742000_40055-1",
						"label": "标识"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_40055"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_74911-0",
						"label": "导尿管",
						"marginRight": "128px"
					}, {
						"score": 0,
						"id": "1615966742000_74911-1",
						"label": "标识"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_74911"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_32344-0",
						"label": "胃管",
						"marginRight": "146px"
					}, {
						"score": 0,
						"id": "1615966742000_32344-1",
						"label": "标识"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_32344"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_560-0",
						"label": "引流管",
						"children": [{
							"score": 0,
							"type": "input",
							"value": "",
							"config": {
								"borderLine": true,
								"readonly": false,
								"prefix": "",
								"prefixAlign": "left",
								"width": "60px",
								"disabled": false,
								"inputType": "input",
								"suffix": "根",
								"prefixWidth": "",
								'keyDisabled': '1615966742000_560-0',
							},
							"key": "1615966742000_72151"
						}]
					}, {
						"score": 0,
						"id": "1615966742000_560-1",
						"label": "标识"
					}, {
						"score": 0,
						"id": "1615966742000_560-2",
						"label": "镇痛泵"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox"
					},
					"key": "1615966742000_560"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "其他",
						"prefixAlign": "left",
						"width": "180px",
						"disabled": false,
						"inputType": "input",
						"suffix": "",
						"prefixWidth": "",
						"noCenter": true
					},
					"key": "1615966742000_36467"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "100%",
				"align": "center",
				'gapTB': '2px',
				"direction": "column"
			}],
			"type": "grid",
			"value": "",
			"config": {
				"borderColor": "#ddd",
				"borderWidth": "1px",
				"borderStyle": "solid"
			},
			"key": "1615966742000_38096"
		}, {
			"columns": [{
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"mConfig": {},
					"type": "text",
					"value": "",
					"config": {
						"width": "300px",
						"weight": "",
						"label": "携带物品:",
						"align": "left"
					},
					"key": "1615966742000_76327"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_66493-0",
						"label": "无"
					}, {
						"score": 0,
						"id": "1615966742000_66493-1",
						"label": "有",
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true,
						"prefix": "义齿/饰物:",
						"prefixWidth": "85px"
					},
					"key": "1615966742000_66493"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_51045-0",
						"label": "病历",
						"marginRight": "0px",
						"marginLeft": '70px'
					}, {
						"score": 0,
						"id": "1615966742000_51045-1",
						"label": "医学影像",
						"marginRight": "0px",
						"children": [{
							"score": 0,
							"type": "input",
							"value": "",
							"config": {
								"borderLine": true,
								"readonly": false,
								"disabled": false,
								"width": "50px",
								"inputType": "input",
								"suffix": "张",
								"marginRight": '0px',
								'keyDisabled': '1615966742000_51045-1',
							},
							"key": "1615966742000_65924"
						}]
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"marginRight": "15px",
					},
					"key": "1615966742000_51045"
				},{
					"options": [{
						"score": 0,
						"id": "1615966742000_75623-0",
						"label": "无"
					}, {
						"score": 0,
						"id": "1615966742000_75623-1",
						"label": "有",
						"marginRight": '10px'
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true,
						"prefix": "病员服:"
					},
					"key": "1615966742000_75623"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_72228-0",
						"label": "无"
					}, {
						"score": 0,
						"id": "1615966742000_72228-1",
						"label": "有"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true,
						"prefix": "药品:"
					},
					"key": "1615966742000_72228"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "input",
						"width": "200px",
						"prefix": "名称/数量:",
						"prefixWidth": "90px"
					},
					"key": "1615966742000_27547"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_58766-0",
						"label": "无"
					}, {
						"score": 0,
						"id": "1615966742000_58766-1",
						"label": "有"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true,
						"prefix": "血制品:"
					},
					"key": "1615966742000_58766"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "input",
						"width": "200px",
						"prefix": "名称/数量:",
						"prefixWidth": "90px"
					},
					"key": "1615966742000_71299"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "input",
						"width": "240px",
						"prefix": "其他:",
						"prefixWidth": "50px"
					},
					"key": "1615966742000_57394"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "",
				"align": "center",
				'gapTB': '2px',
				"direction": "row"
			}, {
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"mConfig": {},
					"type": "text",
					"value": "",
					"config": {
						"width": "300px",
						"weight": "",
						"label": "携带物品:",
						"align": "left"
					},
					"key": "1615966742000_11016"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_25964-0",
						"label": "病历"
					}, {
						"score": 0,
						"id": "1615966742000_25964-1",
						"label": "医学影像",
						"children": [{
							"score": 0,
							"type": "input",
							"value": "",
							"config": {
								"borderLine": true,
								"readonly": false,
								"disabled": false,
								"width": "50px",
								"inputType": "input",
								"suffix": "张",
								'keyDisabled': '1615966742000_25964-1',
							},
							"key": "1615966742000_13414"
						}]
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"marginRight": "15px"
					},
					"key": "1615966742000_25964"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_74218-0",
						"label": "无"
					}, {
						"score": 0,
						"id": "1615966742000_74218-1",
						"label": "有",
						"marginRight": '10px'
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true,
						"prefix": "病员服:"
					},
					"key": "1615966742000_74218"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_1132-0",
						"label": "无"
					}, {
						"score": 0,
						"id": "1615966742000_1132-1",
						"label": "有"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true,
						"prefix": "药品:"
					},
					"key": "1615966742000_1132"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "input",
						"width": "200px",
						"prefix": "名称/数量:",
						"prefixWidth": "90px"
					},
					"key": "1615966742000_97228"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_23277-0",
						"label": "无"
					}, {
						"score": 0,
						"id": "1615966742000_23277-1",
						"label": "有"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true,
						"prefix": "血制品:"
					},
					"key": "1615966742000_23277"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "input",
						"width": "200px",
						"prefix": "名称/数量:",
						"prefixWidth": "90px"
					},
					"key": "1615966742000_12384"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "input",
						"width": "240px",
						"prefix": "其他:",
						"prefixWidth": "50px"
					},
					"key": "1615966742000_87408"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "",
				"align": "center",
				'gapTB': '2px',
				"direction": "row"
			}, {
				"padding": "0 5px",
				"gapLR": "",
				"children": [{
					"mConfig": {},
					"type": "text",
					"value": "",
					"config": {
						"width": "300px",
						"weight": "",
						"label": "携带物品:",
						"align": "left"
					},
					"key": "1615966742000_89696"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_54918-0",
						"label": "病历"
					}, {
						"score": 0,
						"id": "1615966742000_54918-1",
						"label": "医学影像",
						"children": [{
							"score": 0,
							"type": "input",
							"value": "",
							"config": {
								"borderLine": true,
								"readonly": false,
								"disabled": false,
								"width": "50px",
								"inputType": "input",
								"suffix": "张",
								'keyDisabled': '1615966742000_54918-1',
							},
							"key": "1615966742000_93797"
						}]
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"marginRight": "15px"
					},
					"key": "1615966742000_54918"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_77880-0",
						"label": "无"
					}, {
						"score": 0,
						"id": "1615966742000_77880-1",
						"label": "有",
						"marginRight": '10px'
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true,
						"prefix": "病员服:"
					},
					"key": "1615966742000_77880"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_76220-0",
						"label": "无"
					}, {
						"score": 0,
						"id": "1615966742000_76220-1",
						"label": "有"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true,
						"prefix": "药品:"
					},
					"key": "1615966742000_76220"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "input",
						"width": "200px",
						"prefix": "名称/数量:",
						"prefixWidth": "90px"
					},
					"key": "1615966742000_33346"
				}, {
					"options": [{
						"score": 0,
						"id": "1615966742000_9604-0",
						"label": "无"
					}, {
						"score": 0,
						"id": "1615966742000_9604-1",
						"label": "有"
					}],
					"score": 0,
					"type": "checkbox",
					"value": [],
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "checkbox",
						"isRadio": true,
						"prefix": "血制品:"
					},
					"key": "1615966742000_9604"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "input",
						"width": "200px",
						"prefix": "名称/数量:",
						"prefixWidth": "90px"
					},
					"key": "1615966742000_80301"
				}, {
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"disabled": false,
						"inputType": "input",
						"width": "240px",
						"prefix": "其他:",
						"prefixWidth": "50px"
					},
					"key": "1615966742000_47773"
				}],
				"flex": "1",
				"justify": "flex-start",
				"width": "100%",
				"childWidth": "",
				"align": "center",
				'gapTB': '2px',
				"direction": "row"
			}],
			"type": "grid",
			"value": "",
			"config": {
				"borderColor": "#ddd",
				"borderWidth": "1px",
				"borderStyle": "solid"
			},
			"key": "1615966742000_54148"
		}],
		"flex": "1",
		"justify": "",
		"width": "100%",
		"childWidth": "100%",
		"height": "100%",
		"align": "center",
		"gapTB": "0",
		"direction": "row"
	}],
	"type": "grid",
	"value": "",
	"config": {
		"borderColor": "#ddd",
		"borderWidth": "1px",
		"borderStyle": "solid"
	},
	"key": "1615966742000_1673"
},
{
	"mConfig": {},
	"columns": [{
		"padding": "0 10px",
		"gapLR": "0",
		"children": [{
			"mConfig": {},
			"type": "text",
			"value": "",
			"config": {
				"weight": "",
				"label": "R",
				"align": "center"
			},
			"key": "1615966742000_50221"
		}, {
			"mConfig": {},
			"type": "text",
			"value": "",
			"config": {
				"weight": "",
				"label": "建议",
				"align": "center"
			},
			"key": "1615966742000_47548"
		}],
		"flex": "",
		"justify": "center",
		"width": "60px",
		"childWidth": "",
		"align": "center",
		"gapTB": "0",
		"direction": "column"
	}, {
		"padding": "0 0 0 5px",
		"gapLR": "",
		"children": [{
			"options": [{
				"score": 0,
				"id": "1615966742000_21573-0",
				"label": "无",
				"children": [{
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "",
						"prefixAlign": "left",
						"width": "230px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "40px",
						"noCenter": true,
						'keyDisabled': '1615966742000_21573-0',
					},
					"key": "1615966742000_21584"
				}]
			}, {
				"score": 0,
				"id": "1615966742000_21573-1",
				"label": "有",
				"children": [{
					"score": 0,
					"type": "input",
					"value": "",
					"config": {
						"borderLine": true,
						"readonly": false,
						"prefix": "",
						"prefixAlign": "left",
						"width": "230px",
						"disabled": false,
						"inputType": "text",
						"prefixWidth": "40px",
						"noCenter": true,
						'keyDisabled': '1615966742000_21573-1',
					},
					"key": "1615966742000_91449"
				}]
			}],
			"score": 0,
			"type": "checkbox",
			"value": [],
			"config": {
				"borderLine": true,
				"readonly": false,
				"disabled": false,
				"inputType": "checkbox",
				"isRadio": true
			},
			"key": "1615966742000_21573"
		}],
		"flex": 1,
		"justify": "flex-start",
		"width": "auto",
		"childWidth": "auto",
		"align": "",
		"gapTB": "1px",
		"direction": "row"
	}, {
		"padding": "0 0 0 5px",
		"gapLR": "",
		"children": [{
			"options": [{
				"score": 0,
				"id": "1615966742000_79790-0",
				"label": "无"
			}, {
				"score": 0,
				"id": "1615966742000_79790-1",
				"label": "生命体征的变化"
			}, {
				"score": 0,
				"id": "1615966742000_79790-2",
				"label": "管道引流情况"
			}, {
				"score": 0,
				"id": "1615966742000_79790-3",
				"label": "皮肤受压情况"
			}],
			"score": 0,
			"type": "checkbox",
			"value": [],
			"config": {
				"borderLine": true,
				"readonly": false,
				"disabled": false,
				"inputType": "checkbox",
				"NocheckboxGroupFlex": true
			},
			"key": "1615966742000_79790"
		}, {
			"score": 0,
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "其他:",
				"prefixAlign": "left",
				"width": "250px",
				"disabled": false,
				"inputType": "text",
				"prefixWidth": "50px",
				"noCenter": true
			},
			"key": "1615966742000_56631"
		}],
		"flex": 1,
		"justify": "flex-start",
		"width": "auto",
		"childWidth": "auto",
		"align": "center",
		"gapTB": "1px",
		"direction": "row"
	}, {
		"padding": "0 0 0 5px",
		"gapLR": "",
		"children": [{
			"options": [{
				"score": 0,
				"id": "1615966742000_37136-0",
				"label": "无"
			}, {
				"score": 0,
				"id": "1615966742000_37136-1",
				"label": "生命体征的变化"
			}, {
				"score": 0,
				"id": "1615966742000_37136-2",
				"label": "管道引流情况"
			}, {
				"score": 0,
				"id": "1615966742000_37136-3",
				"label": "皮肤受压情况"
			}],
			"score": 0,
			"type": "checkbox",
			"value": [],
			"config": {
				"borderLine": true,
				"readonly": false,
				"disabled": false,
				"inputType": "checkbox",
				"NocheckboxGroupFlex": true
			},
			"key": "1615966742000_37136"
		}, {
			"score": 0,
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "其他:",
				"prefixAlign": "left",
				"width": "250px",
				"disabled": false,
				"inputType": "text",
				"prefixWidth": "50px",
				"noCenter": true
			},
			"key": "1615966742000_50758"
		}],
		"flex": 1,
		"justify": "flex-start",
		"width": "auto",
		"childWidth": "auto",
		"align": "center",
		"gapTB": "1px",
		"direction": "row"
	}],
	"type": "grid",
	"value": "",
	"config": {
		"borderColor": "#ddd",
		"borderWidth": "1px",
		"borderStyle": "solid"
	},
	"key": "1615966742000_95782"
},
{
	"mConfig": {
		"title": "交接人员",
		"isCollapse": true
	},
	"columns": [{
		"padding": "0 10px",
		"gapLR": "0",
		"children": [{
			"mConfig": {
				"hidden": true
			},
			"type": "text",
			"value": "",
			"config": {
				"weight": "",
				"label": "交接人员",
				"align": "center",
			},
			"key": "1615966742000_37190"
		}],
		"flex": "",
		"justify": "center",
		"width": "60px",
		"childWidth": "auto",
		"align": "center",
		"gapTB": "",
		"direction": "row"
	}, {
		"padding": "0 0 0 5px",
		"gapLR": "0",
		"children": [{
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "病房护士:",
				"prefixAlign": "left",
				"width": "200px",
				"disabled": false,
				"inputType": "input",
				"prefixWidth": "85px",
				"clearable": true,
				'noCenter': true
			},
			"key": "1601364493000_9461"
		}, {
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "交接人员:",
				"prefixAlign": "left",
				"width": "200px",
				"disabled": false,
				"inputType": "input",
				"prefixWidth": "85px",
				'noCenter': true
			},
			"key": "1615966742000_71265"
		}, {
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "巡回护士:",
				"prefixAlign": "left",
				"width": "200px",
				"disabled": false,
				"inputType": "input",
				"prefixWidth": "85px",
				'noCenter': true
			},
			"key": "1615966742000_83198"
		}, {
			"score": 0,
			"mConfig": {},
			"type": "date",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "交接时间:",
				"prefixAlign": "left",
				"width": "200px",
				"disabled": false,
				"type": "datetime",
				"prefixWidth": "85px",
				'noCenter': true,
				'showFormat': 'yyyy-MM-dd HH:mm'
			},
			"key": "1601364493000_35518"
		}],
		"flex": 1,
		"justify": "flex-start",
		"width": "",
		"childWidth": "100%",
		"align": "flex-start",
		"gapTB": "1px",
		"direction": "row"
	}, {
		"padding": "0 0 0 5px",
		"gapLR": "0",
		"children": [{
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "巡回护士:",
				"prefixAlign": "left",
				"width": "200px",
				"disabled": false,
				"inputType": "input",
				"prefixWidth": "85px",
				'noCenter': true
			},
			"key": "1615966742000_44558"
		}, {
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "PACU护士:",
				"prefixAlign": "left",
				"width": "188px",
				"disabled": false,
				"inputType": "input",
				"prefixWidth": "95px",
				'noCenter': true
			},
			"key": "1615966742000_20211"
		}, {
			"score": 0,
			"mConfig": {},
			"type": "date",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "交接时间:",
				"prefixAlign": "left",
				"width": "200px",
				"disabled": false,
				"type": "datetime",
				"prefixWidth": "85px",
				"format": "yyyy-MM-dd HH:mm",
				'noCenter': true,
				'showFormat': 'yyyy-MM-dd HH:mm'
			},
			"key": "1615966742000_8221"
		}],
		"flex": 1,
		"justify": "flex-start",
		"width": "",
		"childWidth": "100%",
		"align": "flex-start",
		"gapTB": "1px",
		"direction": "row"
	}, {
		"padding": "0 0 0 5px",
		"gapLR": "0",
		"children": [{
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "PACU/手术室护士:",
				"prefixAlign": "left",
				"width": "140px",
				"disabled": false,
				"inputType": "input",
				"prefixWidth": "140px",
				'noCenter': true
			},
			"key": "1615966742000_78794"
		}, {
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "交接人员:",
				"prefixAlign": "left",
				"width": "200px",
				"disabled": false,
				"inputType": "input",
				"prefixWidth": "85px",
				'noCenter': true
			},
			"key": "1615966742000_46217"
		}, {
			"score": 0,
			"mConfig": {},
			"type": "input",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "ICU/病房护士:",
				"prefixAlign": "left",
				"width": "159px",
				"disabled": false,
				"inputType": "input",
				"prefixWidth": "125px",
				'noCenter': true
			},
			"key": "1615966742000_79523"
		}, {
			"score": 0,
			"mConfig": {},
			"type": "date",
			"value": "",
			"config": {
				"borderLine": true,
				"readonly": false,
				"prefix": "交接时间:",
				"prefixAlign": "left",
				"width": "200px",
				"disabled": false,
				"type": "datetime",
				"prefixWidth": "85px",
				'noCenter': true,
				'showFormat': 'yyyy-MM-dd HH:mm'
			},
			"key": "1615966742000_45968"
		}],
		"flex": 1,
		"justify": "flex-start",
		"width": "",
		"childWidth": "100%",
		"align": "flex-start",
		"gapTB": "1px",
		"direction": "row"
	}],
	"type": "grid",
	"value": "",
	"config": {
		"borderColor": "#ddd",
		"borderWidth": "1px",
		"borderStyle": "solid"
	},
	"key": "1615966742000_86850"
}
]
