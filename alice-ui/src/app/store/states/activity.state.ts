import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Activity } from 'src/app/models/activity';
import { GetActivities, GetActivityDetail } from '../actions/activity.action';
import { ActivityService } from 'src/app/activities/activity.service';
import { tap } from 'rxjs/operators';

export class ActivitiesStateModel {
    Activities:Activity[]
    Activity:Activity
}

@State<ActivitiesStateModel>({
    name: 'activities',
    defaults: {
        Activities: [],
        Activity:null

    }
})
export class ActivityState {

    constructor(private activityService:ActivityService) {
    }

    @Selector()
    static GetActivities(state: ActivitiesStateModel) {
      
        return state.Activities;
    }
    @Selector()
    static selectedActivty(state: ActivitiesStateModel) {
  
        return state.Activity;
    }

    @Action(GetActivities)
    getActivities({ getState, setState }: StateContext<ActivitiesStateModel>) {
        return this.activityService.getActivityList('').pipe(tap((result) => {
            const state = getState();
            setState({
                ...state,
                Activities: result
            });
        }))

     
    }

    @Action(GetActivityDetail)
    getActivityDetail({ getState, setState }: StateContext<ActivitiesStateModel>,{id}:GetActivityDetail) {
        const state = getState(); 
    

        return this.activityService.getActivity(id).pipe(tap((result) => {
            const state = getState();
            setState({
                ...state,
                Activity: result
            });
        }))
        
        

     
    }

   
}