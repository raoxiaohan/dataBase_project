import datetime
import time

from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from wx_login.models import Search
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
# Create your views here.
import json

from django.http import JsonResponse

from wx_login.models import Search, User, Airport, Plane, Order, Passenger, Linkman, Coupons, \
    UserCou, Chengdu, AllPlanes, Seats, PassSeats, PlaneLevel


def dispatcher(request):
    # 将请求参数统一放入request的params属性中
    # GET请求参数在request对象的GET属性中

    if request.method == 'GET':
        request.params = request.GET
        if request.GET['action'] == 'get_inf':
            return get_inf(request)
        if request.GET['action'] == 'get_inf_id':
            return get_inf_id(request)
        if request.GET['action'] == 'get_airport':
            return get_airport(request)
        if request.GET['action'] == 'get_plane':
            return get_plane(request)
        if request.GET['action'] == 'get_plane_id':
            return get_plane_id(request)
        if request.GET['action'] == 'get_order':
            return get_order(request)
        if request.GET['action'] == 'get_order_id':
            return get_order_id(request)
        if request.GET['action'] == 'get_my_passenger':
            return get_my_passenger(request)
        if request.GET['action'] == 'get_plan':
            return get_plan(request)
        if request.GET['action'] == 'for_play':
            return for_play(request)
        if request.GET['action'] == 'get_cou':
            return get_cou(request)
        if request.GET['action'] == 'get_seats':
            return get_seats(request)
        if request.GET['action'] == 'plan_choose':
            return plan_choose_seats(request)
        else:
            return JsonResponse({'ret': 1, 'msg': '不支持该类型http请求'})
        # POST/PUT.DELETE请求参数从request对象的body属性中获取
    elif request.method in ['POST', 'PUT', 'DELETE']:
        print(request.POST)
        # result = json.loads(request.body)
        print(request.POST['action'])
        if request.POST['action'] == 'login':
            return login(request)
        if request.POST['action'] == 'cancel_order':
            return cancel_order(request)
        if request.POST['action'] == 'pay_order':
            return pay_order(request)
        if request.POST['action'] == 'create_pass':
            return create_pass(request)
        if request.POST['action'] == 'pay':
            return pay(request)
        if request.POST['action'] == 'choose_cou':
            return choose_cou(request)
        if request.POST['action'] == 'choose_seat':
            return choose_seats(request)
        else:
            return JsonResponse({'ret': 1, 'msg': '不支持该类型http请求'})
    # 根据不同的action分派给不同你的函数进行处理


def login(request):
    # info = json.loads(request.body).data
    my_name = request.POST['name'],
    print(my_name[0])
    user_list = User.objects.filter(name=my_name[0])
    if len(user_list) == 0:
        record = User.objects.create(
            name=request.POST['name'],
            image=request.POST['image'],
            credit=request.POST['credit'])
        record.save()
    return JsonResponse({"status": True})


def cancel_order(request):
    order_id = request.POST['order_id'],
    print(order_id[0])
    dep_date = Order.objects.filter(id=order_id).first().dep_date
    num = Order.objects.filter(id=order_id).first().plane_num
    pass_num = Order.objects.filter(id=order_id).first().passenger_num
    condition = {
        'date': dep_date,
        'num': num
    }
    plane_id = AllPlanes.objects.filter(**condition).first().id
    remind = Seats.objects.filter(plane_id=plane_id).first().remind
    Seats.objects.filter(plane_id=plane_id).update(remind=remind + int(pass_num))
    Order.objects.filter(id=order_id[0]).update(status=0)
    return JsonResponse({"status": True})


def pay_order(request):
    order_id = request.POST['order_id'],
    print(order_id[0])
    price = Order.objects.filter(id=order_id[0]).first().price * 0.1
    credit = User.objects.filter(id=request.POST['user_id']).first().credit
    User.objects.filter(id=request.POST['user_id']).update(credit=credit + price)
    Order.objects.filter(id=order_id[0]).update(status=2)
    return JsonResponse({"status": True})


def pay(request):
    print(request.POST)
    passengers_id = str(request.POST['select_pass'])
    # 检查乘机人是否购买过该航班
    all_order = Order.objects.filter(dep_date=request.POST['dep_date'], plane_num=request.POST['plane_name'][0:7] +
                                     request.POST['plane_num'], status=2).all()
    all_card = []
    for order in all_order:
        pass_id = order.passengers_id.split(",")
        print(pass_id)
        for p in pass_id:
            card = Passenger.objects.filter(id=p).first().cardnum
            all_card.append(card)
    print(all_card)
    ids = passengers_id.split(",")
    print(ids)
    for i in ids:
        pass_card = Passenger.objects.filter(id=i).first().cardnum
        if pass_card in all_card:
            return JsonResponse({"id": 0})

    o = Order.objects.create(
            user_id=request.POST['user_id'],
            plane_num=request.POST['plane_name'][0:7] + request.POST['plane_num'],
            status=request.POST['status'],
            time=request.POST['time'],
            date=request.POST['date'],
            dep_date=request.POST['dep_date'],
            price=request.POST['price'],
            passenger_num=request.POST['passenger_num'],
            passengers_id=request.POST['select_pass'],
            linkman_name=request.POST['link_name'],
            linkman_phone=request.POST['link_phone']
        )
    # 修改优惠券状态
    condition = {
            'user_id': request.POST['user_id'],
            'cou_id': int(request.POST['coupon'])
        }
    if UserCou.objects.filter(**condition) is not None:
            print(UserCou.objects.filter(**condition))
            UserCou.objects.filter(**condition).update(status=0)
    # 修改航班余座状态
    condition = {
            'date': request.POST['dep_date'],
            'num': request.POST['plane_name'][0:7] + request.POST['plane_num']
        }
    plane_id = AllPlanes.objects.filter(**condition).first().id
    remind = Seats.objects.filter(plane_id=plane_id).first().remind
    pass_num = int(request.POST['passenger_num'])
    Seats.objects.filter(plane_id=plane_id).update(remind=remind - pass_num)
    # 返回订单编号
    condition = {
            'time': o.time,
            'date': o.date
        }
    o_id = Order.objects.filter(**condition).first().id
    print(Order.objects.filter(**condition).first())
    return JsonResponse({"id": o_id})


def create_pass(request):
    post_id = request.POST['id'],
    post_id = post_id[0]

    if post_id == 'undefined':
        p = Passenger.objects.create(
            name=request.POST['name'],
            cardnum=request.POST['cardnum'],
            phone=request.POST['phone'],
            user_id=request.POST['user_id']
        )
    else:
        Passenger.objects.filter(id=post_id).update(name=request.POST['name'])
        Passenger.objects.filter(id=post_id).update(cardnum=request.POST['cardnum'])
        Passenger.objects.filter(id=post_id).update(phone=request.POST['phone'])
    return JsonResponse({"status": True})


def choose_cou(request):
    user_id = request.POST['user_id']
    cou_id = request.POST['cou_id']
    valid = Coupons.objects.filter(id=cou_id).first().valid
    num = Coupons.objects.filter(id=cou_id).first().num
    Coupons.objects.filter(id=cou_id).update(num=num - 1)
    UserCou.objects.create(user_id=user_id, cou_id=cou_id, start_time=datetime.datetime.now().date(),
                           end_time=(datetime.datetime.now().date() + datetime.timedelta(days=valid)).strftime(
                               "%Y-%m-%d"), status=1)
    return JsonResponse({"status": True})


def choose_seats(request):
    # 选座功能
    plane_id = request.POST['plane_id']
    seat_index = request.POST['seat_index']
    seats = Seats.objects.filter(plane_id=plane_id).first().seats.split(",")
    seats[int(seat_index)] = '3'
    seat = ""
    for s in seats:
        seat = seat + s + ","
    Seats.objects.filter(plane_id=plane_id).update(seats=seat[:-1])
    seats = seat.split(",")
    PassSeats.objects.create(pass_id=request.POST['pid'], order_id=request.POST['oid'], seat=int(seat_index))

    return JsonResponse({"status": True, "seat": seats})


def get_inf(request):
    my_name = request.GET['name']
    user_list = User.objects.filter(name=my_name)
    data = {
        'image': user_list.first().image,
        'credit': user_list.first().credit,
        'id': user_list.first().id
    }
    return JsonResponse(data, safe=False)


def get_inf_id(request):
    user_id = request.GET['user_id']
    user_list = UserCou.objects.filter(user_id=int(user_id))
    if user_list.first() is not None:
        print(user_list)
        my_coupons = []
        for cou in user_list:
            print(cou.cou_id)
            coupon = Coupons.objects.filter(id=cou.cou_id).first()
            print(coupon)
            if cou.status == 1:
                my_cou = {
                    'id': coupon.id,
                    'start_time': cou.start_time,
                    'end_time': cou.end_time,
                    'name': coupon.name,
                    'min': coupon.min,
                    'price': coupon.price
                }
                my_coupons.append(my_cou)
        print(my_coupons)
        data = {
            'coupons': my_coupons
        }
    else:
        data = {
            'coupons': []
        }
    return JsonResponse(data, safe=False)


def get_cou(request):
    user_id = request.GET['user_id']
    user_list = UserCou.objects.filter(user_id=int(user_id))
    my = []
    for c in user_list:
        my.append(c.cou_id)
    coupons = Coupons.objects.all()
    cous = []
    for cou in coupons:
        if cou.id not in my:
            my_cou = {
                'id': cou.id,
                'rule': cou.rule,
                'end_time': cou.end_time,
                'name': cou.name,
                'min': cou.min,
                'price': cou.price,
                'num': cou.num,
                'valid': cou.valid
            }
            cous.append(my_cou)
    return JsonResponse({"cous": cous}, safe=False)


def get_airport(request):
    my_city = request.GET['city']
    print(1)
    print(Airport.objects)
    list = Airport.objects.filter(city=my_city)
    print(list)
    data = {
        'phone': list.first().phone,
        'name': list.first().name,
        'id': list.first().id
    }
    return JsonResponse(data, safe=False)


def get_plane(request):
    start = request.GET['start']
    end = request.GET['end']
    date = request.GET['date']
    print(date)
    planes = AllPlanes.objects.filter(dep_city=start, arr_city=end, date=date)
    if planes.first() is None:
        data = {
            'status': "f",
            'list': []
        }
    else:
        p_list = []
        for plane in planes:
            if plane.num is not None:
                plane_id = plane.id
                high = PlaneLevel.objects.filter(plane_id=plane_id).first().hign_price
                low = PlaneLevel.objects.filter(plane_id=plane_id).first().simple_price
                inf = {
                    'name': plane.name,
                    'dep_time': plane.dep_time,
                    'dep_port': plane.dep_airport,
                    'arr_time': plane.arr_time[0:5],
                    'arr_port': plane.arr_airport,
                    'price': plane.price,
                    'high': high,
                    'low': low,
                    'id': plane.id,
                    'num': plane.num[0:7]
                }
                p_list.append(inf)
        data = {
            'status': "t",
            'list': p_list,
        }
    return JsonResponse(data, safe=False)


def get_plane_id(request):
    plane_id = request.GET['plane_id']
    level = request.GET['level']
    l = PlaneLevel.objects.filter(plane_id=plane_id).first()
    if level == "s":
        price = l.hign_price
    else:
        price = l.simple_price
    plane = AllPlanes.objects.filter(id=plane_id).first()
    data = {
        'dep_date': plane.date,
        'name': plane.num[0:7],
        'price': price,
        'num': plane.num[7:]
    }
    return JsonResponse(data, safe=False)


def get_order(request):
    user_id = request.GET['user_id']
    orders = Order.objects.filter(user_id=user_id)
    if orders.first() is None:
        data = {
            'has': True,
            'list': []
        }
    else:
        o_list = []
        for order in orders:
            print(order.dep_date)
            condition = {
                'date': order.dep_date,
                'num': order.plane_num
            }
            plane_inf = AllPlanes.objects.filter(**condition).first()
            inf = {
                'order_id': order.id,
                'plane': order.plane_num,
                'status': order.status,
                'order_time': order.time,
                'order_date': order.date,
                'dep_date': order.dep_date,
                'dep_city': plane_inf.dep_city,
                'dep_time': plane_inf.dep_time,
                'arr_city': plane_inf.arr_city,
                'arr_time': plane_inf.arr_time,
                'price': order.price
            }
            o_list.append(inf)
        data = {
            'has': False,
            'list': o_list
        }
    return JsonResponse(data, safe=False)


def get_order_id(request):
    order_id = request.GET['order_id']
    order = Order.objects.filter(id=order_id).first()
    print(order.plane_num)
    print(order.dep_date)
    # 航班具体信息
    condition = {
        'date': order.dep_date,
        'num': order.plane_num
    }
    plane_inf = AllPlanes.objects.filter(**condition).first()
    # 乘客信息列表
    passengers_list = []
    print(order.passenger_num)
    if order.passenger_num > 1:
        passengers_id = order.passengers_id.split(",")

        for p_o in passengers_id:
            passenger = Passenger.objects.filter(id=p_o).first()
            p = {
                'name': passenger.name,
                'phone': passenger.phone,
                'cardnum': passenger.cardnum
            }
            passengers_list.append(p)
    else:
        passengers_id = order.passengers_id
        print(passengers_id)
        passenger = Passenger.objects.filter(id=passengers_id).first()
        print(passenger)
        p = {
            'name': passenger.name,
            'phone': passenger.phone,
            'cardnum': passenger.cardnum
        }
        passengers_list.append(p)
    # 联系人信息
    data = {
        'order_id': order.id,
        'plane': order.plane_num,
        'status': order.status,
        'order_time': order.time,
        'order_date': order.date,
        'dep_date': order.dep_date,
        'price': order.price,
        'contact_name': order.linkman_name,
        'contact_phone': order.linkman_phone,
        'pass_list': passengers_list,
        'dep_city': plane_inf.dep_city,
        'dep_time': plane_inf.dep_time,
        'arr_city': plane_inf.arr_city,
        'arr_time': plane_inf.arr_time[0:5],
        'dep_port': plane_inf.dep_airport,
        'arr_port': plane_inf.arr_airport,

    }
    return JsonResponse(data, safe=False)


def get_my_passenger(request):
    user_id = request.GET['user_id']
    print(user_id)
    passengers = Passenger.objects.filter(user_id=user_id)
    if passengers.first() is None:
        data = {
            'pass_num': 0,
            'pass_list': []
        }
    else:
        pass_list = []
        for p in passengers:
            inf = {
                'id': p.id,
                'name': p.name,
                'phone': p.phone,
                'cardnum': p.cardnum
            }
            pass_list.append(inf)
        data = {
            'pass_num': len(pass_list),
            'pass_list': pass_list
        }
    return JsonResponse(data, safe=False)


def plan_choose_seats(request):
    user_id = request.GET['user_id']
    orders = Order.objects.filter(user_id=user_id)
    today = datetime.date.today()
    if orders.first() is None:
        data = {
            'has': False,
            'list': []
        }
    else:
        o_list = []
        pass_name = []
        for order in orders:
            print(order.dep_date)
            if today.year <= int(order.dep_date[0:4]):
                if today.month <= int(order.dep_date[5:7]):
                    if today.day <= int(order.dep_date[8:10]):
                        if int(order.status) == 2:
                            condition = {
                                'date': order.dep_date,
                                'num': order.plane_num
                            }
                            plane_inf = AllPlanes.objects.filter(**condition).first()
                            pass_id = order.passengers_id.split(",")
                            print(pass_id)
                            pass_name = []
                            for p in pass_id:
                                p_s = PassSeats.objects.filter(order_id=order.id, pass_id=p)
                                if p_s.first() is None:
                                    p_name = Passenger.objects.filter(id=p).first().name
                                    pa = {
                                        'pid': p,
                                        "p_name": p_name
                                    }
                                    pass_name.append(pa)
                            if pass_name:
                                inf = {
                                    'order_id': order.id,
                                    'plane': order.plane_num,
                                    'dep_date': order.dep_date,
                                    'pass_num': order.passenger_num,
                                    'pass_name': pass_name,
                                    'dep_city': plane_inf.dep_city,
                                    'dep_time': plane_inf.dep_time,
                                    'arr_city': plane_inf.arr_city,
                                    'arr_time': plane_inf.arr_time,
                                }
                                o_list.append(inf)
                                print(o_list)
        if len(o_list) == 0:
            print(1)
            data = {
                'has': False,
                'list': []
            }
        # elif len(pass_name) == 0:
        #     print(2)
        #     data = {
        #             'has': False,
        #             'list': []
        #         }
        else:
            print(3)
            data = {
                'has': True,
                'list': o_list
            }
    return JsonResponse(data, safe=False)


def get_plan(request):
    user_id = request.GET['user_id']
    orders = Order.objects.filter(user_id=user_id)
    today = datetime.date.today()
    if orders.first() is None:
        data = {
            'has': False,
            'list': []
        }
    else:
        o_list = []
        for order in orders:
            print(order.dep_date)
            if today.year <= int(order.dep_date[0:4]):
                if today.month <= int(order.dep_date[5:7]):
                    if today.day <= int(order.dep_date[8:10]):
                        if int(order.status) == 3 or int(order.status) == 2:
                            condition = {
                                'date': order.dep_date,
                                'num': order.plane_num
                            }
                            plane_inf = AllPlanes.objects.filter(**condition).first()
                            pass_id = order.passengers_id.split(",")
                            print(pass_id)
                            pass_name = []
                            for p in pass_id:
                                seat = PassSeats.objects.filter(order_id=order.id, pass_id=p).first()
                                if seat is None:
                                    seat = "未选座"
                                else:
                                    seat = seat.seat
                                p_name = Passenger.objects.filter(id=p).first().name
                                pa = {
                                    'pid': p,
                                    "p_name": p_name,
                                    'p_seat': seat
                                }
                                pass_name.append(pa)
                            inf = {
                                'order_id': order.id,
                                'plane': order.plane_num,
                                'dep_date': order.dep_date,
                                'pass_num': order.passenger_num,
                                'pass_name': pass_name,
                                'dep_city': plane_inf.dep_city,
                                'dep_time': plane_inf.dep_time,
                                'arr_city': plane_inf.arr_city,
                                'arr_time': plane_inf.arr_time,
                            }
                            o_list.append(inf)
                            print(o_list)
        if len(o_list) == 0:
            data = {
                'has': False,
                'list': []
            }
        else:
            print(3)
            data = {
                'has': True,
                'list': o_list
            }
    return JsonResponse(data, safe=False)


def for_play(request):
    visit_place = Chengdu.objects.all()
    print(visit_place)
    data = []
    for place in visit_place:
        p = {
            'name': place.name,
            'comment': place.comment,
            'text': place.text,
            'image': place.image
        }
        data.append(p)
    return JsonResponse(data, safe=False)


def get_seats(request):
    order_id = request.GET['order_id']
    p_dep = Order.objects.filter(id=order_id).first().dep_date
    p_name = Order.objects.filter(id=order_id).first().plane_num
    plane_id = AllPlanes.objects.filter(date=p_dep, num=p_name).first().id
    seats = Seats.objects.filter(plane_id=plane_id).first().seats
    seat = seats.split(",")
    print(seats)
    return JsonResponse({'seats': seat, 'plane_id': plane_id}, safe=False)
